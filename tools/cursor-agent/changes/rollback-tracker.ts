import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import type { ChangeAction } from "../core/types";

export interface AppliedBackup {
  targetPath: string;
  relativePath: string;
  action: ChangeAction;
  originalContent: string;
  appliedAt: Date;
}

export class RollbackTracker {
  private backups: AppliedBackup[] = [];

  record(
    targetPath: string,
    relativePath: string,
    action: ChangeAction,
    originalContent: string
  ): void {
    this.backups.push({
      targetPath,
      relativePath,
      action,
      originalContent,
      appliedAt: new Date(),
    });
  }

  getAppliedCount(): number {
    return this.backups.length;
  }

  getBackups(): readonly AppliedBackup[] {
    return [...this.backups];
  }

  rollback(): { successCount: number; failureCount: number; errors: string[] } {
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // newest first
    for (const backup of [...this.backups].reverse()) {
      try {
        if (backup.action === "create") {
          // created — delete it
          if (existsSync(backup.targetPath)) {
            unlinkSync(backup.targetPath);
          }
          successCount++;
        } else if (backup.action === "update") {
          // updated — restore original
          writeFileSync(backup.targetPath, backup.originalContent, "utf8");
          successCount++;
        }
      } catch (error) {
        failureCount++;
        const msg = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to roll back ${backup.relativePath}: ${msg}`);
      }
    }

    this.backups = [];
    return { successCount, failureCount, errors };
  }
}
