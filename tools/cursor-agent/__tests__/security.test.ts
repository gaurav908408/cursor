import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { normalizeRelativePath, safeTarget } from "../security/paths";
import { isProtected } from "../security/protected";
import { maskSecret } from "../config/env";

describe("Path Security & Normalization", () => {
  it("normalizes valid relative paths", () => {
    assert.equal(normalizeRelativePath("app/page.tsx"), "app/page.tsx");
    assert.equal(normalizeRelativePath("components/../components/Navbar.tsx"), "components/Navbar.tsx");
  });

  it("rejects invalid characters and backslashes", () => {
    assert.throws(() => normalizeRelativePath("app\\page.tsx"), /Invalid relative path/);
    assert.throws(() => normalizeRelativePath("app/page\0.tsx"), /Invalid relative path/);
    assert.throws(() => normalizeRelativePath("/app/page.tsx"), /Invalid relative path/);
    assert.throws(() => normalizeRelativePath("C:/app/page.tsx"), /Invalid relative path/);
  });

  it("rejects path traversal escaping root", () => {
    assert.throws(() => normalizeRelativePath("../secret.txt"), /Path escapes project root/);
    assert.throws(() => normalizeRelativePath("app/../../secret.txt"), /Path escapes project root/);
    assert.throws(() => normalizeRelativePath("."), /Path escapes project root/);
    assert.throws(() => normalizeRelativePath(".."), /Path escapes project root/);
  });

  it("identifies protected files and paths", () => {
    assert.equal(isProtected(".git/config"), true);
    assert.equal(isProtected(".env"), true);
    assert.equal(isProtected(".env.local"), true);
    assert.equal(isProtected(".env.production"), true);
    assert.equal(isProtected("node_modules/next/index.js"), true);
    assert.equal(isProtected(".next/types.d.ts"), true);
    assert.equal(isProtected("dist/bundle.js"), true);
    assert.equal(isProtected("package-lock.json"), true);
    assert.equal(isProtected("yarn.lock"), true);
    assert.equal(isProtected("pnpm-lock.yaml"), true);
    assert.equal(isProtected("app/page.tsx"), false);
    assert.equal(isProtected("components/Navbar.tsx"), false);
  });

  it("enforces safeTarget within project root", () => {
    const root = path.resolve(process.cwd());
    assert.throws(() => safeTarget(".env.local", root), /Protected path/);
    assert.throws(() => safeTarget("node_modules/package.json", root), /Protected path/);
    assert.throws(() => safeTarget("../outside.txt", root), /Path escapes project root/);
  });

  it("masks secrets safely", () => {
    assert.equal(maskSecret("short"), "********");
    assert.equal(maskSecret("my-super-secret-key-12345"), "my-s...2345");
  });
});
