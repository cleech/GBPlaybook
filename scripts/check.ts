#!/usr/bin/env bun
import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import {
  RxDBDevModePlugin,
  disableWarnings as RXDBDisableDevWarnings,
} from "rxdb/plugins/dev-mode";

import DataFile from "../src/components/DataContext.d";
import fs from "node:fs";
import crypto from "node:crypto";

RXDBDisableDevWarnings();
addRxPlugin(RxDBDevModePlugin);

import {
  GBModel,
  GBModelExpanded,
  GBModelDoc,
  GBCharacterPlay,
  GBCharacterPlayDoc,
  ParameterizedTrait,
  GBDatabase,
  GBDataCollections,
  gbGuildSchema,
  gbModelSchema,
  gbCharacterPlaySchema,
  gbCharacterTraitSchema,
} from "../src/models/gbdb";

import { Manifest } from "../src/components/DataContext.d";

export const db: GBDatabase = await createRxDatabase<GBDataCollections>({
  name: "gb_playbook",
  storage: wrappedValidateAjvStorage({ storage: getRxStorageMemory() }),
});

type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

let currentFileVersionForExpand: number;

async function populate_character_traits(doc: GBModelDoc) {
  return Promise.all(
    (doc.character_traits ?? [])
      .map((s) => s.split(/\[|\]/).filter(Boolean))
      .map(async ([name, param]) => {
        const ct = await db.character_traits.findOne(name.trim()).exec();
        return Object.assign({}, ct?.toMutableJSON(), {
          parameter: param?.trim(),
        });
      })
  );
}

export const gbModelDocMethods: GBModelMethods = {
  expand: async function (this: GBModelDoc): Promise<GBModelExpanded> {
    const [character_plays, character_traits]: [
      GBCharacterPlay[],
      ParameterizedTrait[]
    ] = await Promise.all([
      this.populate("character_plays").then(
        (cps) => (cps || []).map((cp: GBCharacterPlayDoc) => cp.toMutableJSON()) // Add safety check
      ),
      populate_character_traits(this),
    ]);
    const model: GBModelExpanded = Object.assign({}, this.toMutableJSON(), {
      character_plays: character_plays,
      character_traits: character_traits,
      // dont let Some/Pneuma count twice for the INF pool
      _inf: this.id === "Pneuma" ? 0 : undefined,
      // mini-statline display
      statLine: `${this.jog}"/${this.sprint}" | ${this.tac} | ${
        this.kickdice
      }/${this.kickdist}" | ${this.def}+ | ${this.arm} | ${this.inf}/${
        this.infmax
      } | ${this.reach ? 2 : 1}"`,
      // get errata level from db metadata
      version: currentFileVersionForExpand,
    });
    return model;
  },
};

await db.addCollections({
  guilds: { schema: gbGuildSchema },
  models: {
    schema: gbModelSchema,
    methods: gbModelDocMethods,
    migrationStrategies: { 1: (doc) => doc },
  },
  character_plays: {
    schema: gbCharacterPlaySchema,
    migrationStrategies: { 1: (doc) => doc },
  },
  character_traits: { schema: gbCharacterTraitSchema },
});

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
  currentFileVersionForExpand = fileEntry.version;

  console.log(`\n\n--- Processing: ${dataFile} ---`);
  console.log(`# Season: ${currentFileVersionForExpand}`);

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
