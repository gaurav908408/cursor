import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { validatePlan } from "../planning/plan-validator";
import {
  extractJsonFromResponse,
  cleanJsonText,
  parseJsonSafely,
} from "../ai/response-handler";
import type { AgentConfig } from "../core/types";
import type { GenerateContentResponse } from "@google/genai";

const mockConfig: AgentConfig = {
  root: path.resolve(process.cwd()),
  apiKey: "test-key",
  model: "gemini-2.5-flash",
  maxFiles: 100,
  maxFileChars: 10_000,
  maxContextChars: 60_000,
  maxChanges: 5,
  maxOutputChars: 50_000,
  maxOutputTokens: 12_000,
};

describe("Plan Validator & Response Handler", () => {
  it("cleans markdown fences from JSON text", () => {
    const fenced = '```json\n{"summary": "Test", "explanation": "OK", "changes": []}\n```';
    assert.equal(cleanJsonText(fenced), '{"summary": "Test", "explanation": "OK", "changes": []}');
  });

  it("validates a well-formed edit plan", () => {
    const raw = {
      summary: "Add utility",
      explanation: "Added helper function",
      changes: [
        {
          path: "components/helper.ts",
          action: "create",
          content: "export const helper = 42;",
        },
      ],
    };

    const validated = validatePlan(raw, "EDIT", mockConfig);
    assert.equal(validated.summary, "Add utility");
    assert.equal(validated.changes.length, 1);
    assert.equal(validated.changes[0].path, "components/helper.ts");
  });

  it("rejects read-only plan that proposes changes", () => {
    const raw = {
      summary: "Summary",
      explanation: "Explaining",
      changes: [
        {
          path: "components/Navbar.tsx",
          action: "update",
          content: "export default function Navbar() {}",
        },
      ],
    };

    assert.throws(() => validatePlan(raw, "READ_ONLY", mockConfig), /Read-only task returned changes/);
  });

  it("detects and catches Unterminated String in JSON with actionable message", () => {
    const truncatedJson = '{"summary": "Incomplete change", "explanation": "Cut off", "changes": [{"path": "app/page.tsx", "action": "update", "content": "export default function Home() { return <div>He';
    assert.throws(
      () => parseJsonSafely(truncatedJson),
      /Gemini output was cut off or contained an unterminated string in JSON/
    );
  });

  it("detects MAX_TOKENS finishReason before parsing", () => {
    const mockResponse = {
      text: '{"summary": "Cut off mid way',
      candidates: [
        {
          finishReason: "MAX_TOKENS",
        },
      ],
    } as unknown as GenerateContentResponse;

    assert.throws(
      () => extractJsonFromResponse(mockResponse, 12_000),
      /Gemini reached the maximum output token limit/
    );
  });

  it("rejects duplicate target paths in plan", () => {
    const raw = {
      summary: "Duplicate test",
      explanation: "Testing duplicates",
      changes: [
        { path: "app/page.tsx", action: "update", content: "v1" },
        { path: "app/page.tsx", action: "update", content: "v2" },
      ],
    };

    assert.throws(() => validatePlan(raw, "EDIT", mockConfig), /Duplicate file modification in plan/);
  });

  it("rejects invalid change action", () => {
    const raw = {
      summary: "Bad action",
      explanation: "Testing bad action",
      changes: [{ path: "app/page.tsx", action: "delete", content: "" }],
    };

    assert.throws(() => validatePlan(raw, "EDIT", mockConfig), /'action' must be 'create' or 'update'/);
  });
});
