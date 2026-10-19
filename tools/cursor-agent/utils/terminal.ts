import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export async function ask(question: string): Promise<string> {
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

export function logHeader(title: string): void {
  console.log(`\n=== ${title} ===`);
}

export function logInfo(message: string): void {
  console.log(message);
}

export function logSuccess(message: string): void {
  console.log(`✓ ${message}`);
}

export function logWarn(message: string): void {
  console.log(`⚠ ${message}`);
}

export function logError(message: string): void {
  console.error(`✗ ${message}`);
}
