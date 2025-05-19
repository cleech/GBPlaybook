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

import { readFile } from "node:fs/promises";

import {
  GBDatabase,
  GBDataCollections,
  gbGuildSchema,
  gbModelSchema,
  gbCharacterPlaySchema,
  gbCharacterTraitSchema,
  gbModelDocMethods,
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
    await gbdbAddCollections(db);
    return db;
  })().catch((err) => {
    gbdbInitPromise = undefined;
    throw err;
  });
  return gbdbInitPromise;
}

export async function clearGBDatabase() {
  const db = await getGBDatabase();
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

export async function gbdbAddCollections(db: GBDatabase) {
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
  fileEntry: FileEntry,
  dataDir: string = "/"
) {
  const db = await getGBDatabase();
  const data: DataFile = await readFile(
    dataDir + fileEntry.filename,
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
