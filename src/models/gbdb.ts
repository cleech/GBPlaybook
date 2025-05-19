import { createRxDatabase, addRxPlugin } from "rxdb";
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

import {
  GBDatabase,
  GBDataCollections,
  gbGuildSchema,
  gbModelSchema,
  gbCharacterPlaySchema,
  gbCharacterTraitSchema,
  gbGameStateSchema,
  GBGameState,
} from "./gbdbTypes";

if (import.meta.env.MODE === "development") {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBCleanupPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

import { gbModelDocMethods } from "./gbdbTypes";

let gbdbInitPromise: Promise<GBDatabase> | undefined = undefined;

export async function getGBDatabase(): Promise<GBDatabase> {
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

    return db;
  })().catch((err) => {
    gbdbInitPromise = undefined;
    throw err;
  });

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
