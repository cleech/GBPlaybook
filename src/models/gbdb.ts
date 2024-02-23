import {
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
  createRxDatabase,
  addRxPlugin,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";

if (import.meta.env.MODE === "development") {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);

type TupleOf<T, N extends number> = [T, ...T[]] & { length: N };
type Playbook = TupleOf<TupleOf<string | null, 7>, 2>;

// Model as it loads from the JSON dataset
export interface GBModel {
  id: string;
  name: string;
  captain: boolean;
  mascot: boolean;
  veteran: boolean;
  seasoned: boolean;
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
  reach: boolean;

  // used in draft screen
  benched?: string;
  dehcneb?: string;

  playbook: Playbook;
  character_plays: string[];
  character_traits: string[];
  heroic?: string;
  legendary?: string;
  types: string;
  base: 30 | 40 | 50;

  guild1: string;
  guild2?: string;
  gbcp: boolean;
}

interface ParameterizedTrait extends GBCharacterTrait {
  parameter?: string;
}

// Expanded Model, with plays and traits populated
// Also adds in additional runtime values
export interface GBModelExpanded
  extends Omit<GBModel, "character_plays" | "character_traits"> {
  character_plays: GBCharacterPlay[];
  character_traits: ParameterizedTrait[];
  health: number;
  _inf?: number;
  statLine: string;
}

type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

function populate_character_traits(doc: GBModelDoc) {
  return Promise.all(
    doc.character_traits
      .map((s) => s.split(/[\[\]]/))
      .map(async ([name, param]) => {
        const ct = await gbdb.character_traits.findOne(name.trim()).exec();
        return Object.assign({}, ct?.toMutableJSON(), {
          parameter: param?.trim(),
        });
      })
  );
}

const gbModelDocMethods: GBModelMethods = {
  expand: async function (this: GBModelDoc): Promise<GBModelExpanded> {
    const [character_plays, character_traits]: [
      GBCharacterPlay[],
      ParameterizedTrait[]
    ] = await Promise.all([
      this.populate("character_plays").then((cps) =>
        cps.map((cp: GBCharacterPlayDoc) => cp.toMutableJSON())
      ),
      populate_character_traits(this),
    ]);
    const model: GBModelExpanded = Object.assign({}, this.toMutableJSON(), {
      character_plays: character_plays,
      character_traits: character_traits,
      health: this.hp,
      // dont let Some/Pneuma count twice for the INF pool
      _inf: this.id === "Pneuma" ? 0 : undefined,
      // mini-statline display
      statLine: `${this.jog}"/${this.sprint}" | ${this.tac} | ${
        this.kickdice
      }/${this.kickdist}" | ${this.def}+ | ${this.arm} | ${this.inf}/${
        this.infmax
      } | ${this.reach ? 2 : 1}"`,
    });
    return model;
  },
};

export type GBModelDoc = RxDocument<GBModel, GBModelMethods>;
export type GBModelCollection = RxCollection<GBModel, GBModelMethods>;

const gbModelSchema: RxJsonSchema<GBModel> = {
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
  indexes: ["guild1", "guild2"],
};

export interface GBGuild {
  name: string;
  minor: boolean;
  color: string;
  shadow?: string;
  darkColor?: string;
  roster: string[];
}

export type GBGuildDoc = RxDocument<GBGuild>;
export type GBGuildCollection = RxCollection<GBGuild>;

const gbGuildSchema: RxJsonSchema<GBGuild> = {
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

interface GBCharacterPlay {
  name: string;
  text: string;
  CST: string;
  RNG: string;
  SUS: boolean;
  OPT: boolean;
}

export type GBCharacterPlayDoc = RxDocument<GBCharacterPlay>;
export type GBCharacterPlayCollection = RxCollection<GBCharacterPlay>;

const gbCharacterPlaySchema: RxJsonSchema<GBCharacterPlay> = {
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

interface GBCharacterTrait {
  name: string;
  active?: boolean;
  text: string;
}

export type GBCharacterTraitDoc = RxDocument<GBCharacterTrait>;
export type GBCharacterTraitCollection = RxCollection<GBCharacterTrait>;

const gbCharacterTraitSchema: RxJsonSchema<GBCharacterTrait> = {
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

export interface GBGameState {
  _id: string;
  guild: string;
  score: number;
  momentum: number;
  disabled: boolean;
  roster: { name: string; health: number }[];
}

export type GBGameStateDoc = RxDocument<GBGameState>;
export type GBGameStateCollection = RxCollection<GBGameState>;

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
    disabled: { type: "boolean", default: false },
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
  },
  required: ["guild", "roster"],
};

interface GBDataCollections {
  guilds: GBGuildCollection;
  models: GBModelCollection;
  character_plays: GBCharacterPlayCollection;
  character_traits: GBCharacterTraitCollection;
  game_state: GBGameStateCollection;
}

export type GBDatabase = RxDatabase<GBDataCollections>;

const gbdb: GBDatabase = await createRxDatabase<GBDataCollections>({
  name: "gb_playbook",
  localDocuments: true,
  storage: getRxStorageDexie(),
  // storage: getRxStorageMemory(),
});

await gbdb.addCollections({
  guilds: { schema: gbGuildSchema },
  models: {
    schema: gbModelSchema,
    methods: gbModelDocMethods,
  },
  character_plays: { schema: gbCharacterPlaySchema },
  character_traits: { schema: gbCharacterTraitSchema },
  game_state: { schema: gbGameStateSchema },
});

// start off at full health
gbdb.game_state.preInsert(async (state) => {
  for (const [index, { name, health }] of state.roster.entries()) {
    const model = await gbdb.models.findOne().where({ id: name }).exec();
    state.roster[index].health = model?.hp ?? 0;
  }
}, false);

export default gbdb;
