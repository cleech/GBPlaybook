import type {
  Model,
  Guild,
  CharacterPlay,
  CharacterTrait,
  GBDataMeta,
} from "../components/DataTypes";

import {
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
  RxCollectionCreator,
} from "rxdb";

import { resolveText } from "../utils/handlebars";

interface ParameterizedTrait extends CharacterTrait {
  parameter?: string;
}

// Expanded Model, with plays and traits populated
// Also adds in additional runtime values
export interface GBModelExpanded
  extends Omit<Model, "character_plays" | "character_traits" | "guild1" | "guild2"> {
  guild1: Guild;
  guild2?: Guild;
  character_plays: CharacterPlay[];
  character_traits: ParameterizedTrait[];
  version: number;
  statLine: string;
  _inf?: number;
}

type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

export type GBModelDoc = RxDocument<Model, GBModelMethods>;
type GBModelCollection = RxCollection<Model, GBModelMethods>;

const gbModelSchema: RxJsonSchema<Model> = {
  title: "Guild Ball model",
  version: 2,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 32 },
    name: { type: "string" },
    captain: { type: "boolean", default: false },
    mascot: { type: "boolean", default: false },
    veteran: { type: "boolean", default: false },
    seasoned: { type: "boolean", default: false },
    hp: { type: "integer", minimum: 0 },
    recovery: { type: "integer", minimum: 0 },
    jog: { type: "integer", minimum: 0 },
    sprint: { type: "integer", minimum: 0 },
    tac: { type: "integer", minimum: 1 },
    kickdice: { type: "integer", minimum: 1 },
    kickdist: { type: "integer", minimum: 0 },
    def: { type: "integer", minimum: 1, maximum: 6 },
    arm: { type: "integer", minimum: 0 },
    inf: { type: "integer", minimum: 0 },
    infmax: { type: "integer", minimum: 0 },
    reach: { type: "boolean", default: false },

    benched: { type: "string" },
    dehcneb: { type: "string" },

    playbook: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "array",
        minItems: 7,
        maxItems: 7,
        items: {
          type: ["string", "null"],
        },
      },
    },

    character_plays: {
      type: "array",
      ref: "character_plays",
      items: { type: "string" },
    },
    character_traits: {
      type: "array",
      ref: "character_traits",
      items: { type: "string" },
    },
    heroic: { type: "string" },
    legendary: { type: "string" },
    types: { type: "string" },
    base: {
      type: "integer",
      enum: [30, 40, 50],
    },
    guild1: { type: "string", maxLength: 32, ref: "guilds" },
    guild2: { type: "string", maxLength: 32, default: "", ref: "guilds" },
    gbcp: { type: "boolean", default: false },
  },
  required: [
    "name",
    "hp",
    "recovery",
    "jog",
    "sprint",
    "tac",
    "kickdice",
    "kickdist",
    "def",
    "arm",
    "inf",
    "infmax",
    "playbook",
    "types",
    "base",
    "guild1",
  ],
  indexes: ["guild1"],
};

export type GBGuildDoc = RxDocument<Guild>;
type GBGuildCollection = RxCollection<Guild>;

const gbGuildSchema: RxJsonSchema<Guild> = {
  title: "Guild Ball guild",
  version: 0,
  primaryKey: "name",
  type: "object",
  properties: {
    name: { type: "string", maxLength: 32 },
    minor: { type: "boolean", default: false },
    color: { type: "string" },
    shadow: { type: "string" },
    darkColor: { type: "string" },
    roster: { type: "array", items: { type: "string" } },
  },
  required: ["color", "roster"],
};

type GBCharacterPlayDoc = RxDocument<CharacterPlay>;
type GBCharacterPlayCollection = RxCollection<CharacterPlay>;

const gbCharacterPlaySchema: RxJsonSchema<CharacterPlay> = {
  title: "Guild Ball character play",
  version: 1,
  primaryKey: "name",
  type: "object",
  properties: {
    name: { type: "string", maxLength: 64 },
    text: { type: "string" },
    CST: { anyOf: [{ type: "string" }, { type: "integer" }] },
    RNG: { anyOf: [{ type: "string" }, { type: "integer" }] },
    SUS: { type: "boolean", default: false },
    OPT: { type: "boolean", default: false },
  },
  required: ["text", "CST", "RNG", "SUS", "OPT"],
};

type GBCharacterTraitDoc = RxDocument<CharacterTrait>;
type GBCharacterTraitCollection = RxCollection<CharacterTrait>;

const gbCharacterTraitSchema: RxJsonSchema<CharacterTrait> = {
  title: "Guild Ball character trait",
  version: 0,
  primaryKey: "name",
  type: "object",
  properties: {
    name: { type: "string", maxLength: 64 },
    active: { type: "boolean", default: false },
    text: { type: "string" },
  },
  required: ["text"],
};

export type GBSetupSteps = "Guilds" | "Draft" | "Game";

export interface GBGameState {
  _id: string;
  guild: string;
  score: number;
  momentum: number;
  roster: { name: string; health: number }[];
  currentStep: GBSetupSteps;
  navigateTo: GBSetupSteps;
}

export type GBGameStateDoc = RxDocument<GBGameState>;
type GBGameStateCollection = RxCollection<GBGameState>;

const gbGameStateSchema: RxJsonSchema<GBGameState> = {
  title: "Guild Ball Game State",
  version: 0,
  primaryKey: "_id",
  type: "object",
  properties: {
    _id: { type: "string", maxLength: 128 },
    guild: { type: "string", ref: "guilds" },
    score: { type: "integer", minimum: 0, default: 0 },
    momentum: { type: "integer", minimum: 0, default: 0 },
    roster: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", ref: "models" },
          health: { type: "integer", minimum: 0 },
        },
        required: ["name", "health"],
      },
    },
    currentStep: { type: "string", enum: ["Guilds", "Draft", "Game"] },
    navigateTo: { type: "string", enum: ["Guilds", "Draft", "Game"] },
  },
  // required: ["guild", "roster"],
};

export interface GBDataCollections {
  guilds: GBGuildCollection;
  models: GBModelCollection;
  character_plays: GBCharacterPlayCollection;
  character_traits: GBCharacterTraitCollection;
  game_state: GBGameStateCollection;
}

export type GBDatabase = RxDatabase<GBDataCollections>;

export class PartialError<T> extends Error {
  partialResult?: T;
  constructor(message: string, partial?: T, options?: ErrorOptions) {
    super(message, options);
    this.name = "PartialError";
    Object.setPrototypeOf(this, PartialError.prototype);
    this.partialResult = partial;
  }
}

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
  const db = doc.collection.database;
  const result = await Promise.all(cps.map(async (cp) => {
    const play = cp.toMutableJSON();
    play.text = await resolveText(play.text, db);
    return play;
  }));
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
  const result = await Promise.all(cts.map(async (ct, index) => {
    const trait = Object.assign(ct.toMutableJSON(), {
      parameter: params[index],
    });
    trait.text = await resolveText(trait.text, db);
    return trait;
  }));
  if (missing.length) {
    throw new PartialError(`unknown traits: ${missing}`, result);
  }
  return result;
}

const gbModelDocMethods: GBModelMethods = {
  expand: async function(this: GBModelDoc): Promise<GBModelExpanded> {
    const db = this.collection.database;
    const dbSettings = await db.getLocal<GBDataMeta>("gbdata_meta");
    let character_plays: CharacterPlay[] | undefined = [];
    let character_traits: ParameterizedTrait[] | undefined = [];
    const guild1: Guild = await this.populate("guild1").then(gdoc => gdoc.toJSON());
    const guild2: Guild = await this.populate("guild2").then(gdoc => gdoc?.toJSON());
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
      guild1: guild1,
      guild2: guild2,
      character_plays: character_plays || [],
      character_traits: character_traits || [],
      // dont let Some/Pneuma count twice for the INF pool
      // or CrossCut
      _inf: ((this.id === "Pneuma") || (this.id === "CrossCut")) ? 0 : undefined,
      // mini-statline display
      statLine: `${this.jog}″/${this.sprint}″ | ${this.tac} | ${this.kickdice
        }/${this.kickdist}″ | ${this.def}+ | ${this.arm} | ${this.inf}/${this.infmax
        } | ${this.reach ? 2 : 1}″`,
      // get errata level from db metadata
      version: dbSettings?.get("version"),
    });

    if (model.heroic) {
      model.heroic = await resolveText(model.heroic, db);
    }
    if (model.legendary) {
      model.legendary = await resolveText(model.legendary, db);
    }

    if (errors.length) {
      throw new PartialError(`${model.id}: Error(s) expanding model`, model, {
        cause: new AggregateError(errors),
      });
    }
    return model;
  },
};

export const gbCollectionsConfig: {
  [collection: string]: RxCollectionCreator;
} = {
  guilds: { schema: gbGuildSchema },
  models: {
    schema: gbModelSchema,
    methods: gbModelDocMethods,
    migrationStrategies: {
      1: (doc) => doc,
      2: (doc) => doc
    },
  },
  character_plays: {
    schema: gbCharacterPlaySchema,
    migrationStrategies: { 1: (doc) => doc },
  },
  character_traits: { schema: gbCharacterTraitSchema },
  game_state: { schema: gbGameStateSchema, localDocuments: true },
};
