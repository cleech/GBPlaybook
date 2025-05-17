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

import { CharacterPlay } from "../src/components/DataTypes";

import {
  GBModelExpanded,
  GBModelDoc,
  GBCharacterPlayDoc,
  GBCharacterTraitDoc,
  ParameterizedTrait,
  GBDatabase,
  GBDataCollections,
  gbGuildSchema,
  gbModelSchema,
  gbCharacterPlaySchema,
  gbCharacterTraitSchema,
} from "../src/models/gbdbTypes";

import { GBDataMeta } from "../src/components/DataTypes";

const db: GBDatabase = await createRxDatabase<GBDataCollections>({
  name: "gb_playbook",
  localDocuments: true,
  storage: wrappedValidateAjvStorage({ storage: getRxStorageMemory() }),
});

export default db;

type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

async function populate_character_plays(
  doc: GBModelDoc
): Promise<CharacterPlay[]> {
  const characterPlays: (GBCharacterPlayDoc | null)[] = await doc.populate(
    "character_plays"
  );
  const cps = characterPlays.filter((cp) => cp !== null);
  const foundPlays = cps.map((cp) => cp.name);
  const missing = doc.character_plays.filter(
    (play) => !foundPlays.includes(play)
  );
  if (missing.length) {
    throw Error(`unknown plays: ${missing}`);
  }
  return cps.map((cp) => cp.toJSON());
}

async function populate_character_traits(
  doc: GBModelDoc
): Promise<ParameterizedTrait[]> {
  const traits: string[] = [];
  const params: (string | undefined)[] = [];
  for (const s of doc.character_traits) {
    const [trait, param] = s.split(/\[|\]/);
    traits.push(trait.trim());
    params.push(param?.trim());
  }
  const db = doc.collection.database;
  const characterTraits: (GBCharacterTraitDoc | null)[] = await Promise.all(
    traits.map((name) => db.character_traits.findOne(name).exec())
  );
  const cts = characterTraits.filter((ct) => ct !== null);
  const foundTraits = cts.map((ct) => ct.name);
  const missing = traits.filter((trait) => !foundTraits.includes(trait));
  if (missing.length) {
    throw Error(`unknown traits: ${missing}`);
  }
  return cts.map((ct, index) =>
    Object.assign(ct.toMutableJSON(), {
      parameter: params[index],
    })
  );
}

const gbModelDocMethods: GBModelMethods = {
  expand: async function (this: GBModelDoc): Promise<GBModelExpanded> {
    const db = this.collection.database;
    const dbSettings = await db.getLocal<GBDataMeta>("gbdata_meta");
    const [character_plays, character_traits]: [
      CharacterPlay[],
      ParameterizedTrait[]
    ] = await Promise.all([
      populate_character_plays(this),
      populate_character_traits(this),
    ]);
    const model: GBModelExpanded = Object.assign(this.toMutableJSON(), {
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
      version: dbSettings?.get("version"),
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
