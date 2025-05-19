#!/usr/bin/env bun

import fs from "node:fs/promises";
import crypto from "node:crypto";

import { Manifest } from "../src/components/DataTypes";
import { GBModelExpanded, PartialError } from "../src/models/gbdbTypes";
import { clearGBDatabase, getGBDatabase, loadGBDatabase } from "./gbdb";

const db = await getGBDatabase();
const dataDir = __dirname + "/../public/data/";

const manifestPath = "manifest.json";
console.log(`\n# Loading manifest from ${manifestPath}`);
const manifest: Manifest = await fs
  .readFile(dataDir + manifestPath, "utf8")
  .then(JSON.parse);

const files: { filename: string; version: number; sha256: string }[] = [];

for (const fileEntry of manifest.datafiles) {
  files.push({
    filename: fileEntry.filename,
    version: fileEntry.version,
    sha256: fileEntry.sha256,
  });
  for (const language in fileEntry.translations) {
    files.push({
      filename: fileEntry.translations[language].filename,
      version: fileEntry.version,
      sha256: fileEntry.translations[language].sha256,
    });
  }
}

function printTest(label: string, ok: boolean) {
  const width = 48;
  const padded = label.padEnd(width, ".");
  console.log(`${padded} ${ok ? "✅" : "❌"}`);
}

for (const fileEntry of files) {
  const dataFile = fileEntry.filename;

  console.log(`\n\n--- Processing: ${dataFile} ---`);
  console.log(`# Season: ${fileEntry.version}`);

  // Clear data from previous file
  // await clearGBDatabase();

  const file = await fs.readFile(dataDir + dataFile, "utf8");
  const hash = crypto.createHash("sha256").update(file).digest("hex");

  if (hash !== fileEntry.sha256) {
    printTest("# Checking SHA256 hash", false);
    console.log(`  Expected ${fileEntry.sha256}`);
    console.log(`  Actual   ${hash}`);
  } else {
    printTest("# Checking SHA256 hash", true);
  }

  let schemaOk = true;
  let schemaErr;
  try {
    // await gbdbAddCollections();
    await loadGBDatabase(fileEntry, dataDir);
  } catch (err) {
    schemaErr = err;
    schemaOk = false;
  }
  printTest(`# Loading with schema validation`, schemaOk);
  if (!schemaOk) {
    console.error(schemaErr);
    // move on to the next file
    clearGBDatabase();
    continue;
  }

  // Play and trait expansion
  let expansionOk = true;
  const models = await db.models.find().exec();
  const mxps = (
    await Promise.all(
      models.map((m) =>
        m.expand().catch((err) => {
          console.log(`\t${m.id}: ${err.message}`);
          if (err instanceof Error) {
            if (err.cause instanceof AggregateError) {
              err.cause.errors.forEach((err) => {
                if (err instanceof Error) {
                  console.log(`\t\t${err.message}`);
                }
              });
            } else if (err.cause instanceof Error) {
              console.log(`\t\t${err.cause.message}`);
            }
          }
          expansionOk = false;
          if (err instanceof PartialError) {
            return err.partialResult as GBModelExpanded;
          }
        })
      )
    )
  ).filter((m) => m !== undefined);
  printTest("# Testing play and trait expansion", expansionOk);

  // Unused Character Plays
  const unusedCP: string[] = [];
  for (const cp of await db.character_plays.find().exec()) {
    let count = 0;
    for (const m of models || []) {
      if (m.character_plays.includes(cp.name)) {
        count += 1;
      }
    }
    if (!count) {
      unusedCP.push(cp.name);
    }
  }
  printTest("# Checking for unused Charater Plays", unusedCP.length === 0);
  if (unusedCP.length) {
    for (const name of unusedCP) {
      console.log(`  ${name.padEnd(46, ".")} ⚠️`);
    }
  }

  // Unused Character Traits
  const unusedCT: string[] = [];
  for (const ct of await db.character_traits.find().exec()) {
    let count = 0;
    for (const m of mxps || []) {
      if (m.character_traits.some((t) => t.name === ct.name)) {
        count += 1;
      }
    }
    if (!count) {
      unusedCT.push(ct.name);
    }
  }
  printTest("# Checking for unused Character Traits", unusedCT.length === 0);
  if (unusedCT.length) {
    for (const name of unusedCT) {
      console.log(`  ${name.padEnd(46, ".")} ⚠️`);
    }
  }
  clearGBDatabase();
}

process.exit(0);
