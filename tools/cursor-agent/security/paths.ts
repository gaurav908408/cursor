import path from "node:path";
import { existsSync, lstatSync } from "node:fs";
import { isProtected } from "./protected";

export function normalizeRelativePath(input: string): string {
  if (
    !input ||
    input.includes("\0") ||
    input.includes("\\") ||
    path.posix.isAbsolute(input) ||
    /^[a-zA-Z]:/.test(input)
  ) {
    throw new Error(`Invalid relative path: ${input}`);
  }

  const normalized = path.posix.normalize(input);

  if (
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(`Path escapes project root: ${input}`);
  }

  return normalized;
}

export function safeTarget(relativePath: string, rootDir: string): string {
  const normalized = normalizeRelativePath(relativePath);

  if (isProtected(normalized)) {
    throw new Error(`Protected path: ${normalized}`);
  }

  const target = path.resolve(rootDir, ...normalized.split("/"));
  const relative = path.relative(rootDir, target);

  if (
    !relative ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`Path is outside the project: ${normalized}`);
  }

  let current = rootDir;

  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);

    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed: ${normalized}`);
    }
  }

  if (existsSync(target) && !lstatSync(target).isFile()) {
    throw new Error(`Target is not a regular file: ${normalized}`);
  }

  return target;
}
