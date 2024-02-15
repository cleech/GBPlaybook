import {
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
  createRxDatabase,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

type GBModelType = {
  id: string;
  name: string;
  captain?: boolean;
  mascot?: boolean;
  veteran?: boolean;
  seasoned?: boolean;
  hp: number;
  recovery: number;
  jog: number;
  sprint: number;
  tac: number;
  kickdice: number;
  kickdist: number;
  def: number;
  arm: number;
  inf: number;
  infmax: number;
  reach?: boolean;

  // used in draft screen, here for completeness
  benched?: string;
  dehcneb?: string;

  playbook: string[][];
  character_plays: string[];
  character_traits: string[];
  heroic?: string;
  legendary?: string;
  types: string;
  base: number;

  guild1: string;
  guild2?: string;
  gbcp?: boolean;
};

type GBModelMethods = {
  setHealth: (hp: number) => void;
  displayName: () => string;
  statLine: () => string;
};

type GBModel = RxDocument<GBModelType, GBModelMethods>;

type GBModelCollection = RxCollection<GBModelType, GBModelMethods>;

const gbModelSchema: RxJsonSchema<GBModelType> = {
  title: "Guild Ball model",
  version: 0,
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
          type: "string",
        },
      },
    },

    character_plays: {
      type: "array",
      items: { type: "string" },
    },
    character_traits: {
      type: "array",
      items: { type: "string" },
    },
    heroic: { type: "string" },
    legendary: { type: "string" },
    types: { type: "string" },
    base: {
      type: "integer",
      enum: [30, 40, 50],
    },
    guild1: { type: "string" },
    guild2: { type: "string" },
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
    "character_plays",
    "character_traits",
    "types",
    "base",
    "guild1",
  ],
};

type GBGuildType = {
  name: string;
  minor?: boolean;
  color: string;
  shadow?: string;
  darkColor: string;
  roster: string[];
};
type GBGuild = RxDocument<GBGuildType>;
type GBGuildCollection = RxCollection<GBGuildType>;

const gbGuildSchema: RxJsonSchema<GBGuildType> = {
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

type GBCharacterPlayType = {
  name: string;
  text: string;
  CST: string;
  RNG: string;
  SUS: boolean;
  OPT: boolean;
};
type GBCharacterPlay = RxDocument<GBCharacterPlayType>;
type GBCharacterPlayCollection = RxCollection<GBCharacterPlayType>;

const gbCharacterPlaySchema: RxJsonSchema<GBCharacterPlayType> = {
  title: "Guild Ball character play",
  version: 0,
  primaryKey: "name",
  type: "object",
  properties: {
    name: { type: "string", maxLength: 64 },
    text: { type: "string" },
    CST: { type: "string" },
    RNG: { type: "string" },
    SUS: { type: "boolean", default: false },
    OPT: { type: "boolean", default: false },
  },
  required: ["text", "CST", "RNG"],
};

type GBCharacterTraitType = {
  name: string;
  active?: boolean;
  text: string;
};
type GBCharacterTrait = RxDocument<GBCharacterTraitType>;
type GBCharacterTraitCollection = RxCollection<GBCharacterTraitType>;

const gbCharacterTraitSchema: RxJsonSchema<GBCharacterTraitType> = {
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

type GBDataCollections = {
  guilds: GBGuildCollection;
  models: GBModelCollection;
  characterPlays: GBCharacterPlayCollection;
  characterTraits: GBCharacterTraitCollection;
};

type GBDatabase = RxDatabase<GBDataCollections>;

const seasonDB: GBDatabase = await createRxDatabase<GBDataCollections>({
  name: "4.5",
  storage: getRxStorageDexie(),
});
seasonDB.addCollections({
  guilds: { schema: gbGuildSchema },
  models: { schema: gbModelSchema },
  characterPlays: { schema: gbCharacterPlaySchema },
  characterTraits: { schema: gbCharacterTraitSchema },
});
