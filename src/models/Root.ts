import { types, Instance, applySnapshot, SnapshotIn } from "mobx-state-tree";
import { persist } from "mst-persist";
import localForage from "localforage";
import { createContext, useContext } from "react";
import { To } from "react-router-dom";

const GBPlayer = types
  .model({
    id: types.string,
    name: types.string,
    captain: types.optional(types.boolean, false),
    mascot: types.optional(types.boolean, false),
    veteran: types.optional(types.boolean, false),
    seasoned: types.optional(types.boolean, false),
    hp: types.integer,
    recovery: types.integer,
    jog: types.integer,
    sprint: types.integer,
    tac: types.integer,
    kickdice: types.integer,
    kickdist: types.integer,
    def: types.integer,
    arm: types.integer,
    inf: types.integer,
    infmax: types.integer,
    reach: types.boolean,

    // used in draft screen, here for completeness
    benched: types.maybe(types.string),
    dehcneb: types.maybe(types.string),

    playbook: types.array(types.array(types.maybeNull(types.string))),
    character_plays: types.array(types.string),
    character_traits: types.array(types.string),
    heroic: types.maybe(types.string),
    legendary: types.maybe(types.string),
    types: types.string,
    base: types.integer,

    guild1: types.string,
    guild2: types.maybe(types.string),
    gbcp: types.optional(types.boolean, false),
  })
  .props({
    // runtime state not loaded from json card data
    health: types.maybe(types.integer),
    // ugly hack for Pneuma adding to team influence pool
    _inf: types.maybe(types.integer),
  })
  .actions((self) => ({
    // initialize runtime state
    afterCreate() {
      if (self.health === undefined) {
        self.health = self.hp;
      }
      if (self.name === "Pneuma") {
        self._inf = 0;
      }
    },
    setHealth(h: number) {
      self.health = h;
    },
  }))
  .views((self) => ({
    get displayName() {
      return (self.veteran ? "v" : "") + (self.seasoned ? "s" : "") + self.name;
    },
    get statLine() {
      return `${self.jog}"/${self.sprint}" | ${self.tac} | ${self.kickdice}/${self.kickdist}" | ${self.def}+ | ${self.arm} | ${self.inf}/${self.infmax}`;
    },
  }));

// export interface IGBPlayer extends Instance<typeof GBPlayer> {}
export type IGBPlayer = Instance<typeof GBPlayer>;
export type JGBPlayer = SnapshotIn<typeof GBPlayer>;

const GBTeam = types
  .model({
    name: types.maybe(types.string),
    roster: types.array(GBPlayer),
    momentum: types.optional(types.integer, 0),
    score: types.optional(types.integer, 0),
    disabled: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setScore(score: number) {
      self.score = score;
    },
    setMomentum(momentum: number) {
      self.momentum = momentum;
    },
    reset(snap: IGBTeamSnapshotIn) {
      applySnapshot(self, snap);
    },
    disable(disabled: boolean) {
      self.disabled = disabled;
    },
  }));

export type IGBTeam = Instance<typeof GBTeam>;
interface IGBTeamSnapshotIn extends SnapshotIn<typeof GBTeam> {}

const Settings = types
  .model({
    colorScheme: types.maybe(types.enumeration(["dark", "light"])),
    dataSet: types.maybe(types.string),
    initialScreen: types.optional(types.string, "/game"),
  })
  .actions((self) => ({
    setColorScheme(scheme: any) {
      self.colorScheme = scheme;
    },
    setDataSet(filename: string) {
      self.dataSet = filename;
    },
    setInitialScreen(route: To) {
      self.initialScreen = route.toString();
    },
  }));

const RootModel = types
  .model({
    team1: types.optional(GBTeam, {}),
    team2: types.optional(GBTeam, {}),
    settings: types.optional(Settings, {}),
    gamePlayRoute: types.optional(types.string, "/game"),
    libraryRoute: types.optional(types.string, "/library"),
  })
  .views((self) => ({
    get resumePossible() {
      return !!self.team1.roster.length && !!self.team2.roster.length;
    },
  }))
  .actions((self) => ({
    setGamePlayRoute(route: string) {
      self.gamePlayRoute = route;
    },
    setLibraryRoute(route: string) {
      self.libraryRoute = route;
    },
  }));

let initialState = RootModel.create({
  team1: { name: "", score: 0, momentum: 0 },
  team2: { name: "", score: 0, momentum: 0 },
  settings: { colorScheme: "dark" },
  gamePlayRoute: "/game",
  libraryRoute: "/library",
});

export const rootStore = initialState;
export type RootInstance = Instance<typeof RootModel>;

export function rootStorePersist() {
  return persist("GBPlaybook", rootStore, {
    storage: localForage,
    jsonify: false,
  });
}

const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;

export function useStore() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
