import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isReadOnlyTask, classifyTaskMode } from "../planning/classifier";

describe("Task Classifier", () => {
  it("correctly identifies read-only inspection tasks", () => {
    assert.equal(isReadOnlyTask("Explain how this project is structured"), true);
    assert.equal(isReadOnlyTask("Summarize the main components in app/"), true);
    assert.equal(isReadOnlyTask("Inspect the package dependencies"), true);
    assert.equal(isReadOnlyTask("Review the code quality"), true);
    assert.equal(classifyTaskMode("Explain this codebase"), "READ_ONLY");
  });

  it("correctly identifies code modification tasks", () => {
    assert.equal(isReadOnlyTask("Add a new button to Navbar.tsx"), false);
    assert.equal(isReadOnlyTask("Fix the bug in page.tsx"), false);
    assert.equal(isReadOnlyTask("Refactor the agent modules"), false);
    assert.equal(isReadOnlyTask("Update the heading in about/page.tsx"), false);
    assert.equal(classifyTaskMode("Create a new contact page"), "EDIT");
  });

  it("prioritizes edit intent when user asks to explain AND change", () => {
    assert.equal(isReadOnlyTask("Explain the issue and fix it"), false);
    assert.equal(classifyTaskMode("Review the navbar and update the logo"), "EDIT");
  });
});
