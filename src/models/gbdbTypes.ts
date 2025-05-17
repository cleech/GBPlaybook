import type {
  Model,
  Guild,
  CharacterPlay,
  CharacterTrait,
} from "../components/DataTypes";

import { RxDatabase, RxCollection, RxJsonSchema, RxDocument } from "rxdb";

export interface ParameterizedTrait extends CharacterTrait {
  parameter?: string;
}

// Expanded Model, with plays and traits populated
// Also adds in additional runtime values
export interface GBModelExpanded
  extends Omit<Model, "character_plays" | "character_traits"> {
  character_plays: CharacterPlay[];
  character_traits: ParameterizedTrait[];
  version: number;
  statLine: string;
  _inf?: number;
}

export type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

export type GBModelDoc = RxDocument<Model, GBModelMethods>;
type GBModelCollection = RxCollection<Model, GBModelMethods>;

export const gbModelSchema: RxJsonSchema<Model> = {
  title: "Guild Ball model",
  version: 1,
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
    guild1: { type: "string", maxLength: 32 },
    guild2: { type: "string", maxLength: 32, default: "" },
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

export const gbGuildSchema: RxJsonSchema<Guild> = {
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

export type GBCharacterPlayDoc = RxDocument<CharacterPlay>;
type GBCharacterPlayCollection = RxCollection<CharacterPlay>;

export const gbCharacterPlaySchema: RxJsonSchema<CharacterPlay> = {
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

export type GBCharacterTraitDoc = RxDocument<CharacterTrait>;
type GBCharacterTraitCollection = RxCollection<CharacterTrait>;

export const gbCharacterTraitSchema: RxJsonSchema<CharacterTrait> = {
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

export const gbGameStateSchema: RxJsonSchema<GBGameState> = {
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
