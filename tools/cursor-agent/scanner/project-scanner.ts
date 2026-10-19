import fg from "fast-glob";
import { readFileSync, lstatSync } from "node:fs";
import { IGNORED_GLOBS, PRIORITY_FILES } from "../config/constants";
import { safeTarget } from "../security/paths";
import type { AgentConfig, ScanResult, ScannedFile } from "../core/types";

export async function scanProject(config: AgentConfig): Promise<ScanResult> {
  const files = await fg("**/*", {
    cwd: config.root,
    onlyFiles: true,
    dot: true,
    ignore: [...IGNORED_GLOBS],
    followSymbolicLinks: false,
  });

  const priorityList = [...PRIORITY_FILES];
  const orderedFiles = [
    ...priorityList.filter((file) => files.includes(file)),
    ...files.filter((file) => !priorityList.includes(file as typeof priorityList[number])).sort(),
  ];

  const includedFiles: ScannedFile[] = [];
  const sections: string[] = [];
  let totalChars = 0;
  let inspectedCount = 0;

  for (const relativePath of orderedFiles) {
    if (inspectedCount >= config.maxFiles) break;
    inspectedCount++;

    try {
      const target = safeTarget(relativePath, config.root);
      const stats = lstatSync(target);

      // Skip files that are disproportionately huge
      if (stats.size > config.maxFileChars * 4) continue;

      const content = readFileSync(target, "utf8");

      // Skip binary files
      if (content.includes("\0")) continue;

      const truncatedContent = content.slice(0, config.maxFileChars);
      const section = [
        `\n--- FILE: ${relativePath} ---`,
        truncatedContent,
        "",
      ].join("\n");

      if (totalChars + section.length > config.maxContextChars) {
        continue;
      }

      sections.push(section);
      totalChars += section.length;
      includedFiles.push({
        relativePath,
        absolutePath: target,
        charCount: truncatedContent.length,
        content: truncatedContent,
      });
    } catch {
      // Ignore inaccessible, binary, or protected files
    }
  }

  return {
    inspectedCount,
    includedFiles,
    totalChars,
    contextString: sections.join("\n"),
  };
}
