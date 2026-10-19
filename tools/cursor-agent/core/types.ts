export type ChangeAction = "create" | "update";

export interface Change {
  path: string;
  action: ChangeAction;
  content: string;
}

export interface Plan {
  summary: string;
  explanation: string;
  changes: Change[];
}

export type TaskMode = "READ_ONLY" | "EDIT";

export interface AgentConfig {
  root: string;
  apiKey: string;
  model: string;
  maxFiles: number;
  maxFileChars: number;
  maxContextChars: number;
  maxChanges: number;
  maxOutputChars: number;
  maxOutputTokens: number;
}

export interface ScannedFile {
  relativePath: string;
  absolutePath: string;
  charCount: number;
  content: string;
}

export interface ScanResult {
  inspectedCount: number;
  includedFiles: ScannedFile[];
  totalChars: number;
  contextString: string;
}

export type ChangeStatus = "applied" | "skipped" | "failed";

export interface ChangeResult {
  path: string;
  action: ChangeAction;
  status: ChangeStatus;
  reason?: string;
  error?: string;
}

export interface ExecutionSummary {
  task: string;
  mode: TaskMode;
  plan: Plan;
  results: ChangeResult[];
  successCount: number;
  skippedCount: number;
  failedCount: number;
}

export interface CommandValidationResult {
  command: string;
  args: string[];
  exitCode: number | null;
  stdout: string;
  stderr: string;
  success: boolean;
}
