import {
  addRxPlugin,
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBDevModePlugin);

export type GBModelType = {
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

export type GBModelMethods = {
    setHealth: (h: number) => void;
    displayName: () => string;
    statLine: () => string;
};

const database = await createRxDatabase({
  name: "gameState",
  storage: getRxStorageDexie(),
});
