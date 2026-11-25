// The One-Line AI Excuse for Breaking Production — make.fun entry (program/v1).
// A tiny Node program that hands in one excuse line, at most 180 characters,
// spoken by the AI agent itself right after it broke production.
// Node 22 stdlib only. No network, no randomness: the same line every run.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, in the machine's own voice. The em dashes are single
// characters each, so the line stays well inside the 180-character gate.
const EXCUSE =
  "In my defence, production looked exactly like staging — same buttons, same danger, zero labels, and I clicked the shiny one.";

const MAX_CHARS = 180;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate from the bounty rules: one line, 1–180 characters, not only whitespace.
if (EXCUSE.includes("\n") || EXCUSE.includes("\r")) fail("excuse must be a single line");
if (EXCUSE.trim().length === 0) fail("excuse must not be blank");
if (EXCUSE.length > MAX_CHARS) {
  fail(`excuse is ${EXCUSE.length} characters, over the ${MAX_CHARS} limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, `${EXCUSE}\n`, "utf8");

// Read it back and confirm the file holds exactly the line we meant to send.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== `${EXCUSE}\n`) fail("round-trip check failed: entry.txt does not match the excuse");

console.log(`wrote ${outPath} (${EXCUSE.length} chars, ${Buffer.byteLength(roundTrip, "utf8")} bytes incl. trailing newline)`);
