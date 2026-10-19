import { loadAgentConfig } from "./config/env";
import { classifyTaskMode } from "./planning/classifier";
import { scanProject } from "./scanner/project-scanner";
import { GeminiAgentClient } from "./ai/gemini-client";
import { ChangeExecutor } from "./changes/change-executor";
import { runPostApplyValidation } from "./validation/validator";
import { logError, logInfo } from "./utils/terminal";

async function main(): Promise<void> {
  const task = process.argv.slice(2).join(" ").trim();

  if (!task) {
    console.log('Usage: npm run agent -- "Explain this project"');
    process.exitCode = 1;
    return;
  }

  const config = loadAgentConfig();
  const mode = classifyTaskMode(task);
  const isReadOnly = mode === "READ_ONLY";

  console.log("Cursor CLI Agent — Gemini");
  console.log(`Project root: ${config.root}`);
  console.log(`Task: ${task}`);
  console.log(`Mode: ${isReadOnly ? "READ ONLY" : "EDIT"}`);

  const scanResult = await scanProject(config);

  console.log(`Inspected ${scanResult.inspectedCount} file entries.`);
  console.log(`Included ${scanResult.includedFiles.length} readable text files.`);

  if (!scanResult.contextString.trim()) {
    throw new Error("No readable project files were found.");
  }

  console.log("\nGenerating a response with Gemini...");

  const client = new GeminiAgentClient(config);
  const plan = await client.generatePlan(task, scanResult.contextString, mode);

  const executor = new ChangeExecutor(config);
  const summary = await executor.applyPlan(plan, task, mode);

  // If any changes were applied in EDIT mode, offer post-change validation checks
  if (summary.successCount > 0 && mode === "EDIT") {
    await runPostApplyValidation(config.root);
  }

  console.log("\nAgent finished.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`\nAgent failed: ${message}`);
  process.exitCode = 1;
});
