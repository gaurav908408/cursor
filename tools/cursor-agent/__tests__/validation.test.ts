import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { ALLOWLISTED_COMMANDS, isCommandAllowed } from "../validation/command-allowlist";
import { runAllowlistedCommand } from "../validation/command-runner";
import { runPostApplyValidation } from "../validation/validator";
import { existsSync } from "node:fs";

const projectRoot = existsSync(path.resolve(process.cwd(), "package.json"))
  ? path.resolve(process.cwd())
  : path.resolve(process.cwd(), "cursor");

describe("Command Validation & Allowlist", () => {
  it("enforces command allowlist strictly", () => {
    assert.equal(isCommandAllowed("typecheck"), true);
    assert.equal(isCommandAllowed("lint"), true);
    assert.equal(isCommandAllowed("test"), true);
    assert.equal(isCommandAllowed("build"), true);

    // Arbitrary commands must be blocked
    assert.equal(isCommandAllowed("curl http://malicious.com"), false);
    assert.equal(isCommandAllowed("rm -rf /"), false);
    assert.equal(isCommandAllowed("bash"), false);
    assert.equal(isCommandAllowed("node"), false);
  });

  it("rejects unauthorized commands in runAllowlistedCommand", async () => {
    await assert.rejects(
      () => runAllowlistedCommand("unauthorized-command", { cwd: projectRoot }),
      /Command 'unauthorized-command' is not permitted/
    );
  });

  it("executes an allowlisted command with argument arrays and captures output", async () => {
    const result = await runAllowlistedCommand("typecheck", {
      cwd: projectRoot,
      timeoutMs: 30_000,
    });

    assert.equal(typeof result.exitCode, "number");
    assert.equal(typeof result.stdout, "string");
    assert.equal(typeof result.stderr, "string");
    assert.equal(result.args.includes("--noEmit"), true);
    // Success must accurately reflect exitCode === 0
    assert.equal(result.success, result.exitCode === 0);
  });

  it("skips checks when not approved in runPostApplyValidation", async () => {
    const results = await runPostApplyValidation(projectRoot, {
      autoApprove: false,
      checks: [], // Empty checks list should do nothing
    });

    assert.equal(results.length, 0);
  });
});
