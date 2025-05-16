import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import {
  RxDBDevModePlugin,
  disableWarnings as RXDBDisableDevWarnings,
} from "rxdb/plugins/dev-mode";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";

RXDBDisableDevWarnings();
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);

import { CharacterPlay } from "../src/components/DataTypes";

import {
  GBModelExpanded,
  GBModelDoc,
  GBCharacterPlayDoc,
  ParameterizedTrait,
  GBDatabase,
  GBDataCollections,
  gbGuildSchema,
  gbModelSchema,
  gbCharacterPlaySchema,
  gbCharacterTraitSchema,
} from "../src/models/gbdb";

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

async function populate_character_traits(doc: GBModelDoc) {
  const db = doc.collection.database;
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

const gbModelDocMethods: GBModelMethods = {
  expand: async function (this: GBModelDoc): Promise<GBModelExpanded> {
    const db = this.collection.database;
    const dbSettings = await db.getLocal<GBDataMeta>("gbdata_meta");
    const [character_plays, character_traits]: [
      CharacterPlay[],
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
