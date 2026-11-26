import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORECAST =
  "Tonight in Flibberton: a low of 34, light drizzle, and fog so thick the lighthouse has filed a formal complaint with the coast guard.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 160) {
    throw new Error(`forecast must be 1-160 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("forecast must be a single line");
  }
  for (const ch of line) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(`forecast contains control character U+${code.toString(16)}`);
    }
  }
  if (line.trim().length === 0) {
    throw new Error("forecast must not be only whitespace");
  }
}

validate(FORECAST);

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, FORECAST, "utf8");

// Read back what was written and validate the on-disk content too.
const written = readFileSync(outPath, "utf8");
validate(written);
if (written !== FORECAST) {
  throw new Error("written entry.txt does not match the forecast");
}
