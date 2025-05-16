#!/usr/bin/env bun

import { DataFile } from "../src/components/DataTypes";
import fs from "node:fs";
import crypto from "node:crypto";

import { GBModel } from "../src/models/gbdb";

import { Manifest } from "../src/components/DataTypes";

import db from "./gbdb";

const dataDir = __dirname + "/../public/data/";

const manifestPath = "manifest.json";
console.log(`\n# Loading manifest from ${manifestPath}`);
const manifestContent = fs.readFileSync(dataDir + manifestPath, "utf8");
const manifest = JSON.parse(manifestContent) as Manifest;

const files: { version: number; filename: string; sha256: string }[] = [];

for (const fileEntry of manifest.datafiles) {
  files.push({
    sha256: fileEntry.sha256,
    filename: fileEntry.filename,
    version: fileEntry.version,
  });
  for (const language in fileEntry.translations) {
    files.push({
      version: fileEntry.version,
      filename: fileEntry.translations[language].filename,
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
  await db.guilds.find().remove();
  await db.models.find().remove();
  await db.character_plays.find().remove();
  await db.character_traits.find().remove();

  const file = fs.readFileSync(dataDir + dataFile, "utf8");
  const hash = crypto.createHash("sha256").update(file).digest("hex");
  const data = JSON.parse(file) as DataFile;

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
    await Promise.all([
      db.guilds.bulkInsert(data.Guilds),
      db.models.bulkInsert(data.Models as GBModel[]),
      db.character_plays.bulkInsert(data["Character Plays"]),
      db.character_traits.bulkInsert(data["Character Traits"]),
      db.upsertLocal("gbdata_meta", fileEntry),
    ]);
  } catch (err) {
    schemaErr = err;
    schemaOk = false;
  }
  printTest(`# Loading with schema validation`, schemaOk);
  if (!schemaOk) {
    console.error(schemaErr);
  }

  // Play and trait expansion
  let expansionOk = true;
  let expansionErr;
  let models, mxps;
  try {
    models = await db.models.find().exec();
    mxps = await Promise.all(
      models.map((m) =>
        m.expand().catch((err) => {
          throw err;
        })
      )
    );
  } catch (err) {
    expansionOk = false;
    expansionErr = err;
  }
  printTest("# Testing play and trait expansion", expansionOk);
  if (!expansionOk) {
    console.error(expansionErr);
  }

  // Unused Character Plays
  const unusedCP: string[] = [];
  for (const cp of await db.character_plays.find().exec()) {
    let count = 0;
    for (const m of models) {
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
    for (const m of mxps) {
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
}

process.exit(0);
