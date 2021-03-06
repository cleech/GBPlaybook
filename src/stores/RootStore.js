import {applySnapshot, types} from 'mobx-state-tree';
import {createContext, useContext} from 'react';

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
  .actions(self => ({
    // initialize runtime state
    afterCreate() {
      if (self.health === undefined) {
        self.health = self.hp;
      }
      if (self.name === 'Pneuma') {
        self._inf = 0;
      }
    },
    setHealth(h) {
      self.health = h;
    },
  }));

const GBTeam = types
  .model({
    name: types.maybe(types.string),
    roster: types.array(GBPlayer),
    momentum: types.optional(types.integer, 0),
    score: types.optional(types.integer, 0),
  })
  .actions(self => ({
    setScore(score) {
      self.score = score;
    },
    setMomentum(momentum) {
      self.momentum = momentum;
    },
    reset(snap) {
      applySnapshot(self, snap);
    },
  }));

const Settings = types
  .model({
    colorScheme: types.maybe(types.enumeration(['dark', 'light'])),
    dataSet: types.maybe(types.string),
    mostRecent: types.maybe(types.string),
    initialScreen: types.optional(types.string, 'Game Play'),
  })
  .actions(self => ({
    setColorScheme(scheme) {
      self.colorScheme = scheme;
    },
    setDataSet(filename) {
      self.dataSet = filename;
    },
    setMostRecent(filename) {
      self.mostRecent = filename;
    },
    setInitialScreen(route) {
      self.initialScreen = route;
    },
  }));

const RootStore = types
  .model({
    team1: types.optional(GBTeam, {}),
    team2: types.optional(GBTeam, {}),
    settings: types.optional(Settings, {}),
  })
  .views(self => ({
    get draftReady() {
      return self.team1.roster.length && self.team2.roster.length;
    },
  }));

export function createRootStore() {
  return RootStore.create({
    team1: {name: '', score: 0, momentum: 0},
    team2: {name: '', score: 0, momentum: 0},
    settings: {colorScheme: 'dark'},
  });
}

export const StoreContext = createContext(null);

export const useStore = () => {
  return useContext(StoreContext);
};
