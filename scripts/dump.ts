#!/usr/bin/env bun

import path from "node:path";
import { getGBDatabase, loadGBDatabase } from "./gbdb";

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

const db = await getGBDatabase();
await loadGBDatabase({ filename: dataFile, version: version });
const models = await db.models.find().exec();
const expanded = await Promise.all(models.map((m) => m.expand()));
console.log(JSON.stringify(expanded, null, 2));
process.exit(0);
