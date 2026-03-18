#!/usr/bin/env bun

import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import { Manifest } from "../src/components/DataTypes";
import { GBModelExpanded, PartialError, GBDatabase } from "../src/models/gbdbTypes";
import { clearGBDatabase, getGBDatabase, loadGBDatabase } from "./gbdb";

// --- Types & Constants ---

const DATA_DIR = path.resolve(__dirname, "../public/data");
const MANIFEST_PATH = path.resolve(DATA_DIR, "manifest.json");
const PADDING_WIDTH = 48;

interface ValidationResult {
  label: string;
  ok: boolean;
  message?: string;
  type: "error" | "warning" | "success";
}

interface FileTask {
  filename: string;
  version: number;
  expectedHash: string;
  expectedTimestamp?: string;
  isGameplan: boolean;
  content?: string;
  actualHash?: string;
}

// --- Reporter ---

class Reporter {
  private results: ValidationResult[] = [];
  hadError = false;

  log(label: string, ok: boolean, message?: string, isWarning = false) {
    const padded = label.padEnd(PADDING_WIDTH, ".");
    const emoji = ok ? "✅" : isWarning ? "⚠️" : "❌";
    console.log(`${padded} ${emoji}`);

    if (message) {
      console.log(`  ${message.replace(/\n/g, "\n  ")}`);
    }

    if (!ok) {
      if (isWarning) {
        this.results.push({ label, ok, message, type: "warning" });
      } else {
        this.hadError = true;
        this.results.push({ label, ok, message, type: "error" });
      }
    } else {
      this.results.push({ label, ok, message, type: "success" });
    }
  }

  printSummary() {
    const errors = this.results.filter(r => r.type === "error");
    const warnings = this.results.filter(r => r.type === "warning");

    console.log("\n" + "=".repeat(PADDING_WIDTH + 4));
    console.log("CHECK SUMMARY");
    console.log("-".repeat(PADDING_WIDTH + 4));
    console.log(`Total Checks: ${this.results.length}`);
    console.log(`Errors:       ${errors.length}`);
    console.log(`Warnings:     ${warnings.length}`);

    if (this.hadError) {
      console.log("\nFAILED checks:");
      errors.forEach(e => console.log(`  ❌ ${e.label}${e.message ? `: ${e.message.split('\n')[0]}` : ""}`));
    }

    if (warnings.length) {
      console.log("\nWARNINGS:");
      warnings.forEach(w => console.log(`  ⚠️ ${w.label}${w.message ? `: ${w.message.split('\n')[0]}` : ""}`));
    }

    console.log("=".repeat(PADDING_WIDTH + 4));
  }
}

const reporter = new Reporter();

// --- Utilities ---

async function getFileHash(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function flattenManifest(manifest: Manifest): FileTask[] {
  const tasks: FileTask[] = [];

  // Datafiles
  for (const entry of manifest.datafiles) {
    tasks.push({
      filename: entry.filename,
      version: entry.version,
      expectedHash: entry.sha256,
      expectedTimestamp: entry.timestamp,
      isGameplan: false,
    });
    for (const lang in entry.translations) {
      const trans = entry.translations[lang];
      tasks.push({
        filename: trans.filename,
        version: entry.version,
        expectedHash: trans.sha256,
        expectedTimestamp: trans.timestamp,
        isGameplan: false,
      });
    }
  }

  // Gameplans
  for (const entry of manifest.gameplans ?? []) {
    tasks.push({
      filename: entry.filename,
      version: entry.version,
      expectedHash: entry.sha256,
      expectedTimestamp: entry.timestamp,
      isGameplan: true,
    });
    if (entry.translations) {
      for (const lang in entry.translations) {
        const trans = entry.translations[lang];
        tasks.push({
          filename: trans.filename,
          version: entry.version,
          expectedHash: trans.sha256,
          expectedTimestamp: trans.timestamp,
          isGameplan: true,
        });
      }
    }
  }

  return tasks;
}

// --- Validation Logic ---

function checkManifestTimestamp(manifest: Manifest, tasks: FileTask[]) {
  const manifestTimestamp = new Date(manifest.timestamp);
  let latestEntryTimestamp = new Date(0);
  let latestEntryFile = "";

  for (const task of tasks) {
    if (task.expectedTimestamp) {
      const entryTS = new Date(task.expectedTimestamp);
      if (entryTS > latestEntryTimestamp) {
        latestEntryTimestamp = entryTS;
        latestEntryFile = task.filename;
      }
    }
  }

  const ok = manifestTimestamp >= latestEntryTimestamp;
  let msg;
  if (!ok) {
    msg = `Manifest timestamp:     ${manifest.timestamp}\nLatest entry timestamp: ${latestEntryTimestamp.toISOString()} (${latestEntryFile})`;
  }
  reporter.log("# Checking manifest timestamp is current", ok, msg);
}

async function validateFile(db: GBDatabase, task: FileTask) {
  console.log(`\n\n--- Processing: ${task.filename} ---`);
  console.log(`# Type: ${task.isGameplan ? "Gameplan" : "Season"} v${task.version}`);

  // 1. Hash check
  const hashOk = task.actualHash === task.expectedHash;
  reporter.log("# Checking SHA256 hash", hashOk, hashOk ? undefined : `Expected ${task.expectedHash}\nActual   ${task.actualHash}`);

  if (task.isGameplan) return; // Gameplans only check hash for now

  // 2. Schema Load
  await clearGBDatabase(db);
  let schemaOk = true;
  let schemaErr;
  try {
    await loadGBDatabase(db, task, DATA_DIR);
  } catch (err) {
    schemaErr = err;
    schemaOk = false;
  }
  reporter.log("# Loading with schema validation", schemaOk, schemaErr?.toString());
  if (!schemaOk) {
    console.dir(schemaErr);
    return
  }

  // 3. Expansion Check
  const models = await db.models.find().exec();
  const expansionErrors: string[] = [];
  const expanded: GBModelExpanded[] = [];

  await Promise.all(models.map(async (m) => {
    try {
      expanded.push(await m.expand());
    } catch (err) {
      if (err instanceof PartialError) {
        expanded.push(err.partialResult as GBModelExpanded);
      }
      if (err instanceof Error) {
        expansionErrors.push(err.message);
        if (err.cause instanceof AggregateError) {
          err.cause.errors.forEach(e => expansionErrors.push(`  ${e.message}`));
        } else if (err.cause instanceof Error) {
          expansionErrors.push(`  ${err.cause.message}`);
        }
      }
    }
  }));

  reporter.log("# Testing play and trait expansion", expansionErrors.length === 0, expansionErrors.join("\n"));

  // 4. Unused Resources Check (Optimized)
  const allPlays = await db.character_plays.find().exec();
  const allTraits = await db.character_traits.find().exec();

  const usedPlays = new Set<string>();
  const usedTraits = new Set<string>();

  // Collect references from models
  expanded.forEach(m => {
    m.character_plays.forEach(p => usedPlays.add(p.name));
    m.character_traits.forEach(t => usedTraits.add(t.name));
  });

  // Collect references from plays and traits (cross-references)
  const traitRefRegex = /\{\{trait '([^']+)'\}\}/g;
  const playRefRegex = /\{\{play '([^']+)'\}\}/g;

  const allPlayNames = new Set(allPlays.map(p => p.name));
  const allTraitNames = new Set(allTraits.map(t => t.name));

  const missingPlays = new Set<string>();
  const missingTraits = new Set<string>();

  const scanText = (text: string | undefined, source: string) => {
    if (!text) return;

    // Reset regex lastIndex to ensure we start from the beginning of each string
    traitRefRegex.lastIndex = 0;
    playRefRegex.lastIndex = 0;

    let match;
    while ((match = traitRefRegex.exec(text)) !== null) {
      const traitName = match[1];
      usedTraits.add(traitName);
      if (!allTraitNames.has(traitName)) {
        missingTraits.add(`'${traitName}' (referenced in '${source}')`);
      }
    }

    while ((match = playRefRegex.exec(text)) !== null) {
      const playName = match[1];
      usedPlays.add(playName);
      if (!allPlayNames.has(playName)) {
        missingPlays.add(`'${playName}' (referenced in '${source}')`);
      }
    }
  };

  allPlays.forEach(p => scanText(p.text, p.name));
  allTraits.forEach(t => scanText(t.text, t.name));

  // Find unused
  const unusedPlays = allPlays.filter(p => !usedPlays.has(p.name)).map(p => p.name);
  const unusedTraits = allTraits.filter(t => !usedTraits.has(t.name)).map(t => t.name);

  reporter.log("# Checking for missing referenced Plays", missingPlays.size === 0, missingPlays.size ? Array.from(missingPlays).join("\n") : undefined);
  reporter.log("# Checking for missing referenced Traits", missingTraits.size === 0, missingTraits.size ? Array.from(missingTraits).join("\n") : undefined);
  reporter.log("# Checking for unused Character Plays", unusedPlays.length === 0, unusedPlays.length ? unusedPlays.join("\n") : undefined, true);
  reporter.log("# Checking for unused Character Traits", unusedTraits.length === 0, unusedTraits.length ? unusedTraits.join("\n") : undefined, true);
}

// --- Main ---

async function main() {
  console.log(`\n# Loading manifest from ${MANIFEST_PATH}`);
  const manifestContent = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest: Manifest = JSON.parse(manifestContent);

  const tasks = flattenManifest(manifest);

  // Parallel file reading and hashing
  await Promise.all(tasks.map(async (task) => {
    task.content = await fs.readFile(path.resolve(DATA_DIR, task.filename), "utf8");
    task.actualHash = await getFileHash(task.content);
  }));

  // Global checks
  checkManifestTimestamp(manifest, tasks);

  // File-by-file checks
  const db = await getGBDatabase();
  for (const task of tasks) {
    await validateFile(db, task);
  }

  reporter.printSummary();
  process.exit(reporter.hadError ? 1 : 0);
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
