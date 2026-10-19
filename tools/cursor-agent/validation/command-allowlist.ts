export interface AllowlistedCommand {
  id: string;
  label: string;
  executable: string;
  args: string[];
  description: string;
}

export const ALLOWLISTED_COMMANDS: Record<string, AllowlistedCommand> = {
  typecheck: {
    id: "typecheck",
    label: "TypeScript Typecheck",
    executable: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["tsc", "--noEmit"],
    description: "Verify TypeScript types without emitting output files",
  },
  lint: {
    id: "lint",
    label: "ESLint",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint"],
    description: "Run ESLint checks as defined in package.json",
  },
  test: {
    id: "test",
    label: "Unit Tests",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["test"],
    description: "Run project tests as defined in package.json",
  },
  build: {
    id: "build",
    label: "Next.js Build",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "build"],
    description: "Run production Next.js build verification",
  },
};

export function isCommandAllowed(commandId: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALLOWLISTED_COMMANDS, commandId);
}
