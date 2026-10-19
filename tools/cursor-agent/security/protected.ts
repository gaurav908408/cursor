import { PROTECTED_FILENAMES, PROTECTED_PARTS } from "../config/constants";

export function isProtected(relativePath: string): boolean {
  const parts = relativePath.split("/");

  // Check path segments against protected directories and patterns
  const hasProtectedSegment = parts.some((part) => {
    if (PROTECTED_PARTS.includes(part as typeof PROTECTED_PARTS[number])) {
      return true;
    }
    if (part === ".env" || part.startsWith(".env.")) {
      return true;
    }
    return false;
  });

  if (hasProtectedSegment) {
    return true;
  }

  // Check the base filename
  const filename = parts[parts.length - 1];
  if (PROTECTED_FILENAMES.includes(filename as typeof PROTECTED_FILENAMES[number])) {
    return true;
  }

  return false;
}
