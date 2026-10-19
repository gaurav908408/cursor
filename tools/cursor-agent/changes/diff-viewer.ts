import { createPatch } from "diff";

export function generateUnifiedDiff(
  filePath: string,
  originalContent: string,
  proposedContent: string
): string {
  return createPatch(
    filePath,
    originalContent,
    proposedContent,
    "current",
    "proposed"
  );
}

export function formatDiffDisplay(diffText: string): string {
  return `\n--- PROPOSED DIFF ---\n${diffText}\n---------------------`;
}
