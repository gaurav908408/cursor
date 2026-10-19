import { existsSync, readFileSync } from "node:fs";
import type { ChangeAction } from "../core/types";

export interface StateCheckResult {
  canProceed: boolean;
  reason?: string;
}

export function checkPreDiffState(
  targetPath: string,
  action: ChangeAction
): StateCheckResult {
  const exists = existsSync(targetPath);

  if (action === "create" && exists) {
    return {
      canProceed: false,
      reason: "File already exists on disk.",
    };
  }

  if (action === "update" && !exists) {
    return {
      canProceed: false,
      reason: "File no longer exists on disk.",
    };
  }

  return { canProceed: true };
}

export function checkStaleState(
  targetPath: string,
  action: ChangeAction,
  expectedOriginalContent: string
): StateCheckResult {
  const existsNow = existsSync(targetPath);

  if (action === "create" && existsNow) {
    return {
      canProceed: false,
      reason: "File appeared after planning (concurrency conflict).",
    };
  }

  if (action === "update" && !existsNow) {
    return {
      canProceed: false,
      reason: "File disappeared after planning.",
    };
  }

  if (action === "update" && existsNow) {
    const currentDiskContent = readFileSync(targetPath, "utf8");
    if (currentDiskContent !== expectedOriginalContent) {
      return {
        canProceed: false,
        reason: "File content changed after planning (stale modification).",
      };
    }
  }

  return { canProceed: true };
}
