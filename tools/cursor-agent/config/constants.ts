export const DEFAULT_CONFIG = {
  MAX_FILES: 100,
  MAX_FILE_CHARS: 10_000,
  MAX_CONTEXT_CHARS: 60_000,
  MAX_CHANGES: 15,
  MAX_OUTPUT_CHARS: 200_000,
  MAX_OUTPUT_TOKENS: 12_000,
  DEFAULT_MODEL: "gemini-2.5-flash",
  TEMPERATURE: 0.1,
} as const;

export const IGNORED_GLOBS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.next/**",
  "**/out/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.vercel/**",
  "**/.env",
  "**/.env.*",
  "**/*.lock",
  "**/package-lock.json",
  "**/pnpm-lock.yaml",
  "**/yarn.lock",
  "**/*.png",
  "**/*.jpg",
  "**/*.jpeg",
  "**/*.webp",
  "**/*.ico",
  "**/*.pdf",
  "**/*.zip",
  "**/*.woff",
  "**/*.woff2",
] as const;

export const PRIORITY_FILES = [
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
  "AGENTS.md",
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/app/page.tsx",
  "src/app/layout.tsx",
] as const;

export const PROTECTED_PARTS = [
  ".git",
  "node_modules",
  ".next",
  ".vercel",
  ".env",
  "dist",
  "build",
  "coverage",
  "out",
] as const;

export const PROTECTED_FILENAMES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
] as const;
