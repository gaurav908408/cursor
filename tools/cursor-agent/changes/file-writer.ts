import { mkdirSync, writeFileSync, renameSync, unlinkSync, existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ChangeAction } from "../core/types";

export function writeAtomically(
  targetPath: string,
  content: string,
  action: ChangeAction
): void {
  const directory = path.dirname(targetPath);
  mkdirSync(directory, { recursive: true });

  if (action === "create") {
    // wx fails if file already exists
    writeFileSync(targetPath, content, {
      encoding: "utf8",
      flag: "wx",
    });
    return;
  }

  // write to tmp, then rename
  const temporaryPath = path.join(
    directory,
    `.cursor-agent-${randomUUID()}.tmp`
  );

  try {
    writeFileSync(temporaryPath, content, {
      encoding: "utf8",
      flag: "wx",
    });

    renameSync(temporaryPath, targetPath);
  } finally {
    if (existsSync(temporaryPath)) {
      try {
        unlinkSync(temporaryPath);
      } catch {
        // cleanup failed, ignore
      }
    }
  }
}
