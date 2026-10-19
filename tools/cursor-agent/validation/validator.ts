import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { ALLOWLISTED_COMMANDS } from "./command-allowlist";
import { runAllowlistedCommand } from "./command-runner";
import { ask, logHeader, logInfo, logSuccess, logError, logWarn } from "../utils/terminal";
import type { CommandValidationResult } from "../core/types";

export interface ValidationWorkflowOptions {
  autoApprove?: boolean;
  checks?: Array<keyof typeof ALLOWLISTED_COMMANDS>;
}

export async function runPostApplyValidation(
  projectRoot: string,
  options: ValidationWorkflowOptions = {}
): Promise<CommandValidationResult[]> {
  const results: CommandValidationResult[] = [];
  const packageJsonPath = path.join(projectRoot, "package.json");
  const tsconfigPath = path.join(projectRoot, "tsconfig.json");

  let packageScripts: Record<string, string> = {};

  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { scripts?: Record<string, string> };
      packageScripts = pkg.scripts || {};
    } catch {
      // ignore, best effort
    }
  }

  // figure out what's available
  const candidates: Array<keyof typeof ALLOWLISTED_COMMANDS> = [];

  if (existsSync(tsconfigPath)) {
    candidates.push("typecheck");
  }

  if (packageScripts.lint) {
    candidates.push("lint");
  }

  if (packageScripts.test) {
    candidates.push("test");
  }

  const checksToConsider = options.checks || candidates;

  if (checksToConsider.length === 0) {
    return results;
  }

  logHeader("Post-Change Validation Checks");
  logInfo("You can optionally run automated checks to verify your project after applying changes.");

  for (const checkId of checksToConsider) {
    const cmd = ALLOWLISTED_COMMANDS[checkId];
    if (!cmd) continue;

    let shouldRun = options.autoApprove ?? false;

    if (!shouldRun) {
      const answer = await ask(
        `Run ${cmd.label} (${cmd.args.join(" ")})? [y/N] `
      );
      shouldRun = ["y", "yes"].includes(answer.toLowerCase());
    }

    if (!shouldRun) {
      logInfo(`Skipped ${cmd.label}.`);
      continue;
    }

    logInfo(`Running ${cmd.label}...`);
    const result = await runAllowlistedCommand(checkId, { cwd: projectRoot });
    results.push(result);

    if (result.success) {
      logSuccess(`${cmd.label} passed successfully.`);
      if (result.stdout) {
        logInfo(result.stdout);
      }
    } else {
      logError(`${cmd.label} failed with exit code ${result.exitCode}.`);
      if (result.stdout) {
        logInfo(result.stdout);
      }
      if (result.stderr) {
        logWarn(result.stderr);
      }
    }
  }

  return results;
}
