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

export class PartialError<T> extends Error {
  partialResult?: T;
  constructor(message: string, partial?: T, options?: ErrorOptions) {
    super(message, options);
    this.partialResult = partial;
  }
}

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
  const result = cps.map((cp) => cp.toJSON());
  if (missing.length) {
    throw new PartialError(`unknown plays: ${missing}`, result);
  }
  return result;
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
  const result = cts.map((ct, index) =>
    Object.assign(ct.toMutableJSON(), {
      parameter: params[index],
    })
  );
  if (missing.length) {
    throw new PartialError(`unknown traits: ${missing}`, result);
  }
  return result;
}

const gbModelDocMethods: GBModelMethods = {
  expand: async function (this: GBModelDoc): Promise<GBModelExpanded> {
    const db = this.collection.database;
    const dbSettings = await db.getLocal<GBDataMeta>("gbdata_meta");
    let character_plays: CharacterPlay[] | void = [];
    let character_traits: ParameterizedTrait[] | void = [];
    const errors: Error[] = [];
    [character_plays, character_traits] = await Promise.all([
      populate_character_plays(this).catch(
        (err: PartialError<CharacterPlay[]>) => {
          errors.push(err);
          return err.partialResult;
        }
      ),
      populate_character_traits(this).catch(
        (err: PartialError<ParameterizedTrait[]>) => {
          errors.push(err);
          return err.partialResult;
        }
      ),
    ]);
    const model: GBModelExpanded = Object.assign(this.toMutableJSON(), {
      character_plays: character_plays || [],
      character_traits: character_traits || [],
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
    if (errors.length) {
      throw new PartialError("Error(s) expanding model", model, {
        cause: new AggregateError(errors),
      });
    }
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
