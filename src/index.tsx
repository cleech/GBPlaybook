import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import GamePlay, { TeamSelect, Draft, Game } from "./routes/GamePlay";
import Library, {
  GamePlans,
  GuildList,
  RefCards,
  Roster,
} from "./routes/library";
import Settings from "./routes/settings";

import { DataProvider } from "./components/DataContext";
import { CardPrintScreen } from "./routes/print";

import { SettingsDoc, SettingsProvider } from "./models/settings";
import { defaultSettings } from "./hooks/useSettings";

import gbdb from "./models/gbdb";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

import "./utils/i18next";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <Navigate
            to={await gbdb
              .getLocal<SettingsDoc>("settings")
              .then((settings) => {
                const route: string =
                  settings?.get("initialScreen") ??
                  defaultSettings.initialScreen;
                if (route === "/game") {
                  return settings?.get("gamePlayRoute") ?? route;
                }
                if (route === "/library") {
                  return settings?.get("libraryRoute") ?? route;
                }
                return route;
              })}
            replace
          />
        }
      />
      <Route element={<App />}>
        <Route element={<GamePlay />}>
          <Route path="game" element={<TeamSelect />} />
          <Route path="game/draft" element={<Draft />} />
          <Route path="game/draft/play" element={<Game />} />
        </Route>
        <Route path="library" element={<Library />}>
          <Route index element={<GuildList />} />
          <Route path="gameplans" element={<GamePlans />} />
          <Route path="refcards" element={<RefCards />} />
          <Route path=":guild" element={<Roster />} />
        </Route>
        <Route path="print" element={<CardPrintScreen />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </>
  )
);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <SettingsProvider>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </SettingsProvider>
  // </React.StrictMode>
);
