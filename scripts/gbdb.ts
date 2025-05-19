import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import {
  RxDBDevModePlugin,
  disableWarnings as RXDBDisableDevWarnings,
} from "rxdb/plugins/dev-mode";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";

RXDBDisableDevWarnings();
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

import path from "node:path";
import { readFile } from "node:fs/promises";

import {
  GBDatabase,
  GBDataCollections,
  gbCollectionsConfig,
} from "../src/models/gbdbTypes";
import { DataFile } from "../src/components/DataTypes";

let gbdbInitPromise: Promise<GBDatabase> | undefined = undefined;
export async function getGBDatabase(): Promise<GBDatabase> {
  if (gbdbInitPromise) return gbdbInitPromise;
  gbdbInitPromise = (async () => {
    const db: GBDatabase = await createRxDatabase<GBDataCollections>({
      name: "gb_playbook",
      localDocuments: true,
      storage: wrappedValidateAjvStorage({ storage: getRxStorageMemory() }),
    });
    await db.addCollections(gbCollectionsConfig);
    return db;
  })().catch((err) => {
    gbdbInitPromise = undefined;
    throw err;
  });
  return gbdbInitPromise;
}

export async function clearGBDatabase(db: GBDatabase) {
  try {
    await Promise.all([
      db.getLocal("gbdata_meta").then((doc) => doc?.remove()),
      db.guilds.find().remove(),
      db.models.find().remove(),
      db.character_plays.find().remove(),
      db.character_traits.find().remove(),
    ]);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Accepts the RxDB bulkInsert result type
function throwOnError<T, E>(result: {
  success: T[];
  error: E[];
}): typeof result {
  if (result.error.length) throw new AggregateError(result.error);
  return result;
}

interface FileEntry {
  filename: string;
  version?: number;
  sha256?: string;
}

export async function loadGBDatabase(
  db: GBDatabase,
  fileEntry: FileEntry,
  dataDir: string = ""
) {
  const data: DataFile = await readFile(
    path.resolve(dataDir, fileEntry.filename),
    "utf8"
  ).then(JSON.parse);
  await Promise.all([
    db.guilds.bulkInsert(data.Guilds).then(throwOnError),
    db.models.bulkInsert(data.Models).then(throwOnError),
    db.character_plays.bulkInsert(data["Character Plays"]).then(throwOnError),
    db.character_traits.bulkInsert(data["Character Traits"]).then(throwOnError),
    db.upsertLocal("gbdata_meta", fileEntry),
  ]);
}
