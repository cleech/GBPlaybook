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
import path from "node:path";

const argFile = process.argv[2];
if (!argFile) {
  console.error(`Usage: bun dump.ts <filename.json>`);
  process.exit(1);
}
const dataFile = path.join(process.cwd(), argFile);
const versionMatch = /GB-Playbook-(\d+)-(\d+)(?:\.[a-z]{2})?\.json/.exec(
  dataFile
);
const version = versionMatch
  ? Number(`${versionMatch[1]}.${versionMatch[2]}`)
  : 0;

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

export const db: GBDatabase = await createRxDatabase<GBDataCollections>({
  name: "gb_playbook",
  storage: wrappedValidateAjvStorage({ storage: getRxStorageMemory() }),
});

type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

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
      version: version,
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

const data = JSON.parse(fs.readFileSync(dataFile, "utf8")) as DataFile;

await Promise.all([
  db.guilds.bulkInsert(data.Guilds),
  db.models.bulkInsert(data.Models as GBModel[]),
  db.character_plays.bulkInsert(data["Character Plays"]),
  db.character_traits.bulkInsert(data["Character Traits"]),
]);

const models = await db.models.find().exec();
const mxps = await Promise.all(models.map((m) => m.expand()));
console.log(JSON.stringify(mxps, null, 2));
process.exit(0);
