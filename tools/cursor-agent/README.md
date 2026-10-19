# Cursor CLI Agent — Gemini

A modular, production-grade coding agent built with TypeScript, Node.js, and Google Gemini (`@google/genai`).

The agent scans project context, prompts Gemini with structured schemas and security boundaries, generates full-file change plans, displays unified diffs, prompts for explicit user approval before every modification, writes files atomically, and runs optional post-change validation checks.

---

## Architecture Overview

```
tools/cursor-agent/
├── index.ts                     # CLI orchestrator & entry point
├── config/
│   ├── constants.ts             # Limits, ignore rules, protected directories
│   └── env.ts                   # Safe .env.local loader (zero secret leakage)
├── core/
│   └── types.ts                 # Domain models (Plan, Change, TaskMode, ExecutionSummary)
├── security/
│   ├── paths.ts                 # Path normalization, traversal checks, symlink verification
│   └── protected.ts             # Protected files & paths (.git, .env*, lockfiles, build dirs)
├── scanner/
│   └── project-scanner.ts       # fast-glob scanning, priority file ordering, context budgets
├── ai/
│   ├── gemini-client.ts         # GoogleGenAI client, anti-prompt-injection system prompt
│   └── response-handler.ts      # finishReason inspection (MAX_TOKENS), code fence unwrap, safe JSON parse
├── planning/
│   ├── classifier.ts            # Read-only vs. Edit mode detection
│   └── plan-validator.ts        # Strict JSON schema validation, duplicate path rejection
├── changes/
│   ├── diff-viewer.ts           # Unified diff generation (diff.createPatch)
│   ├── file-writer.ts           # Atomic file writing (wx flag, temp file + rename)
│   ├── state-checker.ts         # Stale / concurrency collision detection
│   ├── rollback-tracker.ts      # Reverse rollback tracking & safety recovery
│   └── change-executor.ts       # User approval prompt [y/N], change application, summary
├── validation/
│   ├── command-allowlist.ts     # Pre-approved safe commands (tsc, lint, test, build)
│   ├── command-runner.ts        # Spawn runner with argument arrays & timeout (no shell injection)
│   └── validator.ts             # Post-change interactive validation workflow
└── __tests__/
    ├── security.test.ts         # Path traversal, symlink, and protected-file tests
    ├── plan-validator.test.ts   # Response handler, MAX_TOKENS truncation, and schema tests
    ├── classifier.test.ts       # Read-only vs edit mode classification tests
    ├── changes.test.ts          # Diff viewer, atomic writer, stale state, and rollback tests
    └── validation.test.ts       # Command allowlist enforcement and runner tests
```

---

## Setup & Configuration

1. **Environment Variables**:
   Create or edit `.env.local` in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
   *(Supported models include `gemini-2.5-flash`, `gemini-3.8-flash`, etc.)*

2. **Credentials Protection**:
   The loader in `config/env.ts` only reads required variables and never prints or logs them to the terminal. `.env*` files are strictly protected from modification.

---

## Usage

### 1. Read-Only Tasks (Explain, Inspect, Analyze)
When tasks only ask to understand or inspect the codebase, the agent automatically activates **READ ONLY** mode:
```bash
npm run agent -- "Explain how the routing and components are structured"
npm run agent -- "Review the dependencies in package.json"
```
In read-only mode, the agent guarantees that **no file changes will ever be proposed or written**.

### 2. Edit Tasks (Implement, Fix, Refactor)
When tasks request modifications, the agent operates in **EDIT** mode:
```bash
npm run agent -- "Add a new Button component in components/Button.tsx"
npm run agent -- "Update the footer text in app/layout.tsx"
```

### 3. Interactive Workflow:
1. **Context Collection**: Inspects readable files up to context character limits.
2. **Plan Generation**: Gemini produces a structured JSON plan with `summary`, `explanation`, and `changes`.
3. **Diff Preview**: Displays a unified diff (`--- current / +++ proposed`) for each file.
4. **Per-File Approval**: Prompts `Approve [create/update] for "<path>"? [y/N]`.
5. **Atomic Write**: Saves approved changes safely; skips unapproved or stale files.
6. **Execution Summary**: Reports count of applied, skipped, and failed changes.
7. **Post-Apply Validation**: If files were modified, prompts to run automated checks (`typecheck`, `lint`, `test`).

---

## Reliability & Fix for "Unterminated string in JSON"

Previous versions failed with `Unterminated string in JSON` when the model output exceeded token limits. This has been resolved:

1. **Finish Reason Inspection**:
   - `ai/response-handler.ts` explicitly inspects `candidate.finishReason`.
   - If `finishReason === "MAX_TOKENS"`, it throws an actionable error explaining that the output token limit was reached and guides the user to narrow the task.
2. **Markdown Code Fence Stripping**:
   - Automatically removes leading/trailing ````json ... ```` fences before parsing.
3. **Safe Diagnostics**:
   - If an unexpected syntax error occurs, a preview of the truncated tail is printed along with suggestions to break down large edits.
4. **No Corrupt Code Injection**:
   - Does not perform blind regex string patching that could corrupt source code.

---

## Security Protections

- **Confined Paths**: All paths are resolved against `ROOT` and verified to prevent `..` escapes.
- **Symlink Prevention**: Traverses every directory segment using `lstatSync` and rejects any symlinks.
- **Protected File Rule**: Forbids AI modification of `.git`, `node_modules`, `.next`, `.vercel`, `.env*`, build folders, and lockfiles.
- **Prompt Injection Defense**: Scanned project files are wrapped inside an untrusted data boundary so they cannot override system instructions.
- **Stale Detection**: Verifies that files have not been created, deleted, or edited on disk after planning.
- **Command Allowlist**: Restricts validation commands to a strict dictionary (`typecheck`, `lint`, `test`, `build`) and invokes them with argument arrays rather than shell string concatenation.

---

## Running Agent Tests

To run the unit test suite:
```bash
npm run agent:test
```
This runs 25 automated tests covering path security, schema validation, token truncation, diff generation, atomic writes, rollback safety, and command allowlists.
