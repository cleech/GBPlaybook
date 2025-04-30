import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import {
  createHashRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import GamePlay, { TeamSelect, Draft, Game } from "./pages/GamePlay";
import Library, {
  GamePlans,
  GuildList,
  RefCards,
  Roster,
} from "./pages/library";
import Settings from "./pages/settings";

import { DataProvider } from "./components/DataContext";
import { CardPrintScreen } from "./pages/print";

import { SettingsDoc, SettingsProvider } from "./models/settings";
import { defaultSettings } from "./models/defaultSettings";

import gbdb from "./models/gbdb";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

import "./utils/i18next";

const router = createHashRouter(
  [
    {
      path: "/",
      element:
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
    },
    {
      element: <App />,
      children: [
        {
          element: <GamePlay />,
          children: [
            { path: "game", element: <TeamSelect /> },
            { path: "game/draft", element: <Draft /> },
            { path: "game/draft/play", element: <Game /> },
          ]
        },
        {
          path: "library", element: <Library />,
          children: [
            { index: true, element: <GuildList /> },
            { path: "gameplans", element: <GamePlans /> },
            { path: "refcards", element: <RefCards /> },
            { path: ":guild", element: <Roster /> },
          ]
        },
        { path: "print", element: <CardPrintScreen /> },
        { path: "settings", element: <Settings /> },
      ]
    },
  ]
);
const root = createRoot(
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
