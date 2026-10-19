import { existsSync, readFileSync } from "node:fs";
import { safeTarget } from "../security/paths";
import { generateUnifiedDiff } from "./diff-viewer";
import { writeAtomically } from "./file-writer";
import { checkPreDiffState, checkStaleState } from "./state-checker";
import { RollbackTracker } from "./rollback-tracker";
import { ask, logInfo, logSuccess, logWarn, logError } from "../utils/terminal";
import type { AgentConfig, ChangeResult, ExecutionSummary, Plan, TaskMode } from "../core/types";

export interface ChangeExecutorOptions {
  autoApprove?: boolean;
}

export class ChangeExecutor {
  private config: AgentConfig;
  private rollbackTracker: RollbackTracker;

  constructor(config: AgentConfig) {
    this.config = config;
    this.rollbackTracker = new RollbackTracker();
  }

  getRollbackTracker(): RollbackTracker {
    return this.rollbackTracker;
  }

  async applyPlan(
    plan: Plan,
    task: string,
    mode: TaskMode,
    options: ChangeExecutorOptions = {}
  ): Promise<ExecutionSummary> {
    logInfo(`\nPlan: ${plan.summary}`);

    if (plan.explanation.trim()) {
      logInfo(`\n${plan.explanation}`);
    }

    logInfo(`\nProposed file changes: ${plan.changes.length}`);

    const results: ChangeResult[] = [];

    if (plan.changes.length === 0) {
      logInfo("No files need to be changed.");
      return {
        task,
        mode,
        plan,
        results,
        successCount: 0,
        skippedCount: 0,
        failedCount: 0,
      };
    }

    for (const change of plan.changes) {
      try {
        const target = safeTarget(change.path, this.config.root);
        const preCheck = checkPreDiffState(target, change.action);

        if (!preCheck.canProceed) {
          logWarn(`Skipped ${change.path}: ${preCheck.reason}`);
          results.push({
            path: change.path,
            action: change.action,
            status: "skipped",
            reason: preCheck.reason,
          });
          continue;
        }

        const existed = existsSync(target);
        const originalContent = existed ? readFileSync(target, "utf8") : "";

        if (originalContent === change.content) {
          logInfo(`No changes needed: ${change.path}`);
          results.push({
            path: change.path,
            action: change.action,
            status: "skipped",
            reason: "Proposed content is identical to existing content.",
          });
          continue;
        }

        const diffText = generateUnifiedDiff(
          change.path,
          originalContent,
          change.content
        );

        console.log(`\n${diffText}`);

        let approved = options.autoApprove ?? false;

        if (!approved) {
          const answer = await ask(
            `Approve ${change.action} for "${change.path}"? [y/N] `
          );
          approved = ["y", "yes"].includes(answer.toLowerCase());
        }

        if (!approved) {
          logInfo("Skipped by user.");
          results.push({
            path: change.path,
            action: change.action,
            status: "skipped",
            reason: "Declined by user.",
          });
          continue;
        }

        // Re-check target immediately before write to avoid concurrency issues
        const verifiedTarget = safeTarget(change.path, this.config.root);
        const staleCheck = checkStaleState(
          verifiedTarget,
          change.action,
          originalContent
        );

        if (!staleCheck.canProceed) {
          logWarn(`Skipped ${change.path}: ${staleCheck.reason}`);
          results.push({
            path: change.path,
            action: change.action,
            status: "skipped",
            reason: staleCheck.reason,
          });
          continue;
        }

        // Record for rollback before writing
        this.rollbackTracker.record(
          verifiedTarget,
          change.path,
          change.action,
          originalContent
        );

        writeAtomically(verifiedTarget, change.content, change.action);
        logSuccess(`Saved: ${change.path}`);

        results.push({
          path: change.path,
          action: change.action,
          status: "applied",
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logError(`Failed to apply change to ${change.path}: ${errorMsg}`);
        results.push({
          path: change.path,
          action: change.action,
          status: "failed",
          error: errorMsg,
        });
      }
    }

    const summary: ExecutionSummary = {
      task,
      mode,
      plan,
      results,
      successCount: results.filter((r) => r.status === "applied").length,
      skippedCount: results.filter((r) => r.status === "skipped").length,
      failedCount: results.filter((r) => r.status === "failed").length,
    };

    this.printSummary(summary);
    return summary;
  }

  private printSummary(summary: ExecutionSummary): void {
    logInfo("\n--- Execution Summary ---");
    logInfo(`Applied: ${summary.successCount}`);
    logInfo(`Skipped: ${summary.skippedCount}`);
    if (summary.failedCount > 0) {
      logError(`Failed:  ${summary.failedCount}`);
    } else {
      logInfo(`Failed:  ${summary.failedCount}`);
    }
  }
}
