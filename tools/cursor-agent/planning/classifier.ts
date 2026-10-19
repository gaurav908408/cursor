import type { TaskMode } from "../core/types";

export function isReadOnlyTask(task: string): boolean {
  const asksToExplain =
    /\b(explain|describe|summari[sz]e|review|inspect|analy[sz]e|understand|find|search|list|check)\b/i.test(
      task
    );

  const asksToChange =
    /\b(fix|implement|create|modify|change|update|add|remove|delete|refactor|rewrite|edit|build|write|patch|replace)\b/i.test(
      task
    );

  return asksToExplain && !asksToChange;
}

export function classifyTaskMode(task: string): TaskMode {
  return isReadOnlyTask(task) ? "READ_ONLY" : "EDIT";
}
