import { normalizeRelativePath, safeTarget } from "../security/paths";
import { isProtected } from "../security/protected";
import type { AgentConfig, Plan, TaskMode } from "../core/types";

export function validatePlan(
  rawPlan: unknown,
  mode: TaskMode,
  config: AgentConfig
): Plan {
  if (!rawPlan || typeof rawPlan !== "object") {
    throw new Error("Gemini returned an invalid change plan: expected a JSON object.");
  }

  const candidate = rawPlan as Partial<Plan>;

  if (typeof candidate.summary !== "string" || !candidate.summary.trim()) {
    throw new Error("Invalid plan: 'summary' must be a non-empty string.");
  }

  if (typeof candidate.explanation !== "string") {
    throw new Error("Invalid plan: 'explanation' must be a string.");
  }

  if (!Array.isArray(candidate.changes)) {
    throw new Error("Invalid plan: 'changes' must be an array.");
  }

  if (candidate.changes.length > config.maxChanges) {
    throw new Error(
      `Plan proposed ${candidate.changes.length} changes, exceeding maximum allowed limit of ${config.maxChanges}.`
    );
  }

  if (mode === "READ_ONLY" && candidate.changes.length > 0) {
    throw new Error("Read-only task returned changes. No files were modified.");
  }

  const seenTargets = new Set<string>();
  const validatedChanges: Plan["changes"] = [];

  for (let i = 0; i < candidate.changes.length; i++) {
    const change = candidate.changes[i];

    if (!change || typeof change !== "object") {
      throw new Error(`Invalid file change at index ${i}: expected an object.`);
    }

    if (typeof change.path !== "string" || !change.path.trim()) {
      throw new Error(`Invalid file change at index ${i}: 'path' must be a non-empty string.`);
    }

    if (typeof change.content !== "string") {
      throw new Error(`Invalid file change at index ${i} ('${change.path}'): 'content' must be a string.`);
    }

    if (change.action !== "create" && change.action !== "update") {
      throw new Error(
        `Invalid file change at index ${i} ('${change.path}'): 'action' must be 'create' or 'update', got '${String(change.action)}'.`
      );
    }

    const normalized = normalizeRelativePath(change.path);

    if (normalized !== change.path) {
      throw new Error(`Unsafe path format at index ${i}: '${change.path}' (must be normalized forward-slash).`);
    }

    if (isProtected(normalized)) {
      throw new Error(`Cannot modify protected path: '${normalized}'.`);
    }

    const target = safeTarget(normalized, config.root);

    if (seenTargets.has(target)) {
      throw new Error(`Duplicate file modification in plan: '${normalized}'.`);
    }
    seenTargets.add(target);

    if (change.content.length > config.maxOutputChars) {
      throw new Error(
        `Proposed file content for '${normalized}' is too large (${change.content.length} chars, limit is ${config.maxOutputChars}).`
      );
    }

    validatedChanges.push({
      path: normalized,
      action: change.action,
      content: change.content,
    });
  }

  return {
    summary: candidate.summary.trim(),
    explanation: candidate.explanation.trim(),
    changes: validatedChanges,
  };
}
