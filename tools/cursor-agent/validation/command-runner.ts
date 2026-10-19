import { spawn } from "node:child_process";
import { ALLOWLISTED_COMMANDS, isCommandAllowed } from "./command-allowlist";
import type { CommandValidationResult } from "../core/types";

export interface RunCommandOptions {
  timeoutMs?: number;
  cwd: string;
}

export async function runAllowlistedCommand(
  commandId: string,
  options: RunCommandOptions
): Promise<CommandValidationResult> {
  if (!isCommandAllowed(commandId)) {
    throw new Error(
      `Command '${commandId}' is not permitted. Only predefined allowlisted commands may be executed.`
    );
  }

  const cmd = ALLOWLISTED_COMMANDS[commandId];
  const timeoutMs = options.timeoutMs ?? 60_000;

  return new Promise<CommandValidationResult>((resolve) => {
    let stdout = "";
    let stderr = "";
    let isTimedOut = false;

    // Use spawn with argument arrays directly.
    // stdio: ["ignore", "pipe", "pipe"] prevents commands from hanging on stdin prompts.
    const child = spawn(cmd.executable, cmd.args, {
      cwd: options.cwd,
      shell: process.platform === "win32",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        command: cmd.executable,
        args: cmd.args,
        exitCode: -1,
        stdout,
        stderr: `${stderr}\nExecution error: ${error.message}`.trim(),
        success: false,
      });
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      if (isTimedOut) {
        stderr += `\nCommand timed out after ${timeoutMs / 1000} seconds.`;
      }

      resolve({
        command: cmd.executable,
        args: cmd.args,
        exitCode: isTimedOut ? -1 : code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        success: !isTimedOut && code === 0,
      });
    });
  });
}
