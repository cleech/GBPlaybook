import {
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
  createRxDatabase,
  addRxPlugin,
} from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBCleanupPlugin } from "rxdb/plugins/cleanup";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";

import {
  replicateWebRTC,
  getConnectionHandlerSimplePeer,
  SimplePeer,
  RxWebRTCReplicationPool,
} from "rxdb/plugins/replication-webrtc";

import { BehaviorSubject, map as rxjsMap, Subscription } from "rxjs";

if (import.meta.env.MODE === "development") {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBCleanupPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

type TupleOf<T, N extends number> = [T, ...T[]] & { length: N };
type Playbook = TupleOf<TupleOf<string | null, 7>, 2>;

import { GBDataMeta } from "../components/DataContext";

// Model as it loads from the JSON dataset
export interface GBModel {
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
  gbcp?: boolean;
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
  version: number;
  statLine: string;
  _inf?: number;
}

type GBModelMethods = {
  expand: () => Promise<GBModelExpanded>;
};

async function populate_character_traits(doc: GBModelDoc) {
  const db = await getGBDatabase();
  return Promise.all(
    (doc.character_traits || []) // Add safety check for potentially undefined traits
      .map((s) => s.split(/[[\]]/))
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
    const db = await getGBDatabase();
    const dbSettings = await db.getLocal<GBDataMeta>("gbdata_meta");
    const [character_plays, character_traits]: [
      GBCharacterPlay[],
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

export type GBModelDoc = RxDocument<GBModel, GBModelMethods>;
type GBModelCollection = RxCollection<GBModel, GBModelMethods>;

const gbModelSchema: RxJsonSchema<GBModel> = {
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

export interface GBGuild {
  name: string;
  minor: boolean;
  color: string;
  shadow?: string;
  darkColor?: string;
  roster: string[];
}

export type GBGuildDoc = RxDocument<GBGuild>;
type GBGuildCollection = RxCollection<GBGuild>;

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

type GBCharacterPlayDoc = RxDocument<GBCharacterPlay>;
type GBCharacterPlayCollection = RxCollection<GBCharacterPlay>;

const gbCharacterPlaySchema: RxJsonSchema<GBCharacterPlay> = {
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

interface GBCharacterTrait {
  name: string;
  active?: boolean;
  text: string;
}

// type GBCharacterTraitDoc = RxDocument<GBCharacterTrait>;
type GBCharacterTraitCollection = RxCollection<GBCharacterTrait>;

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

interface GBDataCollections {
  guilds: GBGuildCollection;
  models: GBModelCollection;
  character_plays: GBCharacterPlayCollection;
  character_traits: GBCharacterTraitCollection;
  game_state: GBGameStateCollection;
}

export type GBDatabase = RxDatabase<GBDataCollections>;

let gbdb: GBDatabase | null = null;
let gbdbInitPromise: Promise<GBDatabase> | null = null;

export async function getGBDatabase(): Promise<GBDatabase> {
  if (gbdb) return gbdb;
  if (gbdbInitPromise) return gbdbInitPromise;

  gbdbInitPromise = (async () => {
    console.log("Initializing GBDatabase...");

    const db = await createRxDatabase<GBDataCollections>(
      import.meta.env.MODE === "development"
        ? {
            name: "gb_playbook",
            localDocuments: true,
            storage: wrappedValidateAjvStorage({
              storage: getRxStorageDexie(),
            }),
          }
        : {
            name: "gb_playbook",
            localDocuments: true,
            storage: getRxStorageDexie(),
          }
    );

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
      game_state: { schema: gbGameStateSchema, localDocuments: true },
    });

    gbdb = db;
    return gbdb;
  })();

  return gbdbInitPromise;
}

const iceConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
        // "stun:stun.relay.metered.ca:80",
      ],
    },
    {
      urls: [
        "turn:standard.relay.metered.ca:80",
        "turn:standard.relay.metered.ca:80?transport=tcp",
        "turn:standard.relay.metered.ca:443",
        "turns:standard.relay.metered.ca:443?transport=tcp",
      ],
      username: import.meta.env.VITE_METERED_USERNAME,
      credential: import.meta.env.VITE_METERED_PASSWORD,
    },
  ],
};

export const peerConnected$ = new BehaviorSubject<boolean>(false);

let replicationPool: RxWebRTCReplicationPool<GBGameState, SimplePeer> | null =
  null;
let replicationSubscriptions: Subscription[] = [];

export async function gbdbBeginReplication(url: string, topic: string) {
  const db = await getGBDatabase();

  if (replicationPool) {
    console.warn("Replication already active");
    return replicationPool;
  }

  replicationPool = await replicateWebRTC<GBGameState, SimplePeer>({
    collection: db.game_state,
    connectionHandlerCreator: getConnectionHandlerSimplePeer({
      signalingServerUrl: url,
      config: iceConfig,
    }),
    topic,
    pull: {},
    push: {},
  });

  replicationSubscriptions.push(
    replicationPool.error$.subscribe((err) => {
      console.log("replication error:");
      console.dir(err);
    })
  );

  replicationSubscriptions.push(
    replicationPool.peerStates$
      .pipe(
        rxjsMap((peers) => {
          return Array.from(peers.values()).reduce(
            (connected, state) => connected || state.peer.connected,
            false
          );
        })
      )
      .subscribe((connected: boolean) => {
        peerConnected$.next(connected);
      })
  );

  return replicationPool;
}

export async function gbdbStopReplication() {
  if (replicationPool) {
    await replicationPool.cancel();
    replicationPool = null;
  }
  replicationSubscriptions.forEach((sub) => sub.unsubscribe());
  replicationSubscriptions = [];
  peerConnected$.next(false);
}
