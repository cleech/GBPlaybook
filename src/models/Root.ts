import { types, Instance } from "mobx-state-tree";
import { persist } from "mst-persist";
import localForage from "localforage";
import { createContext, useContext } from "react";
import { To } from "react-router-dom";

const Settings = types
  .model({
    // colorScheme: types.maybe(types.enumeration(["dark", "light"])),
    dataSet: types.maybe(types.string),
    initialScreen: types.optional(types.string, "/game"),
    networkPlay: types.optional(types.boolean, false),
    gameSize: types.optional(types.number, 6),
    uiPreferences: types.optional(
      types.model({
        displayStatLine: types.optional(types.boolean, false),
      }),
      {}
    ),
    cardPreferences: types.optional(
      types.model({
        perferedStyled: types.optional(
          types.enumeration(["sfg", "gbcp"]),
          "gbcp"
        ),
      }),
      {}
    ),
  })
  .actions((self) => ({
    // setColorScheme(scheme: any) {
    //   self.colorScheme = scheme;
    // },
    setDataSet(filename: string) {
      self.dataSet = filename;
    },
    setInitialScreen(route: To) {
      self.initialScreen = route.toString();
    },
    setGameSize(size: number) {
      self.gameSize = size;
    },
    setNetworkPlay(net: boolean) {
      self.networkPlay = net;
    },
    setCardStyle(style: string) {
      self.cardPreferences.perferedStyled = style;
    },
    setStatLine(display: boolean) {
      self.uiPreferences.displayStatLine = display;
    },
  }));

const RootModel = types
  .model({
    settings: types.optional(Settings, {}),
    gamePlayRoute: types.optional(types.string, "/game"),
    libraryRoute: types.optional(types.string, "/library"),
  })
  // .views((self) => ({
    // get resumePossible() {
    //   return !!self.team1.roster.length && !!self.team2.roster.length;
    // },
  // }))
  .actions((self) => ({
    setGamePlayRoute(route: string) {
      self.gamePlayRoute = route;
    },
    setLibraryRoute(route: string) {
      self.libraryRoute = route;
    },
  }));

const initialState = RootModel.create({
  // settings: { colorScheme: "dark" },
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
