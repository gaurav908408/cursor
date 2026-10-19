import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { existsSync, readFileSync, unlinkSync, rmSync, mkdirSync } from "node:fs";
import { generateUnifiedDiff } from "../changes/diff-viewer";
import { writeAtomically } from "../changes/file-writer";
import { checkPreDiffState, checkStaleState } from "../changes/state-checker";
import { RollbackTracker } from "../changes/rollback-tracker";
import { ChangeExecutor } from "../changes/change-executor";
import type { AgentConfig, Plan } from "../core/types";

const testDir = path.resolve(process.cwd(), ".test-scratch-phase3");

const testConfig: AgentConfig = {
  root: testDir,
  apiKey: "test",
  model: "test-model",
  maxFiles: 10,
  maxFileChars: 1000,
  maxContextChars: 5000,
  maxChanges: 5,
  maxOutputChars: 5000,
  maxOutputTokens: 1000,
};

describe("Changes Engine & Rollback Safety", () => {
  before(() => {
    mkdirSync(testDir, { recursive: true });
  });

  after(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("generates readable unified diffs", () => {
    const diff = generateUnifiedDiff("file.txt", "line 1\nline 2", "line 1\nline 2 modified");
    assert.match(diff, /---\s+file\.txt/);
    assert.match(diff, /\+\+\+\s+file\.txt/);
    assert.match(diff, /\+line 2 modified/);
  });

  it("writes files atomically with create and update", () => {
    const targetFile = path.join(testDir, "test-file.txt");

    // Test Create
    writeAtomically(targetFile, "initial content", "create");
    assert.equal(existsSync(targetFile), true);
    assert.equal(readFileSync(targetFile, "utf8"), "initial content");

    // Test 'create' flag wx fails if file already exists
    assert.throws(() => writeAtomically(targetFile, "overwrite", "create"));

    // Test Update
    writeAtomically(targetFile, "updated content", "update");
    assert.equal(readFileSync(targetFile, "utf8"), "updated content");
  });

  it("detects pre-diff and stale state conditions", () => {
    const filePath = path.join(testDir, "state-test.txt");
    writeAtomically(filePath, "original", "create");

    // Pre-diff create should fail because it exists
    const preCheckCreate = checkPreDiffState(filePath, "create");
    assert.equal(preCheckCreate.canProceed, false);

    // Pre-diff update should succeed
    const preCheckUpdate = checkPreDiffState(filePath, "update");
    assert.equal(preCheckUpdate.canProceed, true);

    // Stale check update with mismatching content should fail
    const staleMismatch = checkStaleState(filePath, "update", "different original");
    assert.equal(staleMismatch.canProceed, false);

    // Stale check update with matching content should succeed
    const staleMatch = checkStaleState(filePath, "update", "original");
    assert.equal(staleMatch.canProceed, true);
  });

  it("safely rolls back applied changes", () => {
    const tracker = new RollbackTracker();
    const createdFile = path.join(testDir, "rollback-created.txt");
    const updatedFile = path.join(testDir, "rollback-updated.txt");

    writeAtomically(updatedFile, "original content before run", "create");

    // Apply create
    writeAtomically(createdFile, "new content", "create");
    tracker.record(createdFile, "rollback-created.txt", "create", "");

    // Apply update
    tracker.record(updatedFile, "rollback-updated.txt", "update", "original content before run");
    writeAtomically(updatedFile, "modified content", "update");

    assert.equal(existsSync(createdFile), true);
    assert.equal(readFileSync(updatedFile, "utf8"), "modified content");

    // Execute rollback
    const report = tracker.rollback();
    assert.equal(report.successCount, 2);
    assert.equal(report.failureCount, 0);

    // Verify created file was deleted
    assert.equal(existsSync(createdFile), false);

    // Verify updated file was restored
    assert.equal(readFileSync(updatedFile, "utf8"), "original content before run");
  });

  it("executes change plan with ChangeExecutor", async () => {
    const executor = new ChangeExecutor(testConfig);
    const plan: Plan = {
      summary: "Add a new module",
      explanation: "Testing automated execution",
      changes: [
        {
          path: "auto-created.txt",
          action: "create",
          content: "hello world",
        },
      ],
    };

    const summary = await executor.applyPlan(plan, "test task", "EDIT", { autoApprove: true });
    assert.equal(summary.successCount, 1);
    assert.equal(summary.skippedCount, 0);
    assert.equal(summary.failedCount, 0);

    const createdPath = path.join(testDir, "auto-created.txt");
    assert.equal(existsSync(createdPath), true);
    assert.equal(readFileSync(createdPath, "utf8"), "hello world");
  });
});
