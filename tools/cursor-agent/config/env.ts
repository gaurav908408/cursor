import dotenv from "dotenv";
import path from "node:path";
import { realpathSync, existsSync } from "node:fs";
import { DEFAULT_CONFIG } from "./constants";
import type { AgentConfig } from "../core/types";

export function loadAgentConfig(customCwd?: string): AgentConfig {
  const root = realpathSync(customCwd || process.cwd());
  const envLocalPath = path.resolve(root, ".env.local");

  if (existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
  } else {
    // try default .env
    dotenv.config();
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Please add it to .env.local in the project root."
    );
  }

  const model =
    process.env.GEMINI_MODEL?.trim() || DEFAULT_CONFIG.DEFAULT_MODEL;

  return {
    root,
    apiKey,
    model,
    maxFiles: DEFAULT_CONFIG.MAX_FILES,
    maxFileChars: DEFAULT_CONFIG.MAX_FILE_CHARS,
    maxContextChars: DEFAULT_CONFIG.MAX_CONTEXT_CHARS,
    maxChanges: DEFAULT_CONFIG.MAX_CHANGES,
    maxOutputChars: DEFAULT_CONFIG.MAX_OUTPUT_CHARS,
    maxOutputTokens: DEFAULT_CONFIG.MAX_OUTPUT_TOKENS,
  };
}

export function maskSecret(secret: string): string {
  if (!secret || secret.length <= 8) {
    return "********";
  }
  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}
