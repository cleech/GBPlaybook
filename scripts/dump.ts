#!/usr/bin/env bun

import type { DataFile } from "../src/components/DataContext";
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

import { GBModel } from "../src/models/gbdb";

import db from "./gbdb";

const data = JSON.parse(fs.readFileSync(dataFile, "utf8")) as DataFile;

await Promise.all([
  db.guilds.bulkInsert(data.Guilds),
  db.models.bulkInsert(data.Models as GBModel[]),
  db.character_plays.bulkInsert(data["Character Plays"]),
  db.character_traits.bulkInsert(data["Character Traits"]),
  db.upsertLocal("gbdata_meta", {
    version: version,
    filename: dataFile,
  }),
]);

const models = await db.models.find().exec();
const mxps = await Promise.all(models.map((m) => m.expand()));
console.log(JSON.stringify(mxps, null, 2));
process.exit(0);
