// src/index.tsx
import React from "react"; // Import React if using StrictMode or Fragments
import { createRoot } from "react-dom/client";
import "./index.css";
// Remove unused imports if App, GamePlay etc. are only used via routes
// import App from "./App";
// import GamePlay, { TeamSelect, Draft, Game } from "./pages/GamePlay";
// import Library, { GamePlans, GuildList, RefCards, Roster } from "./pages/library";
// import Settings from "./pages/settings";
// import { CardPrintScreen } from "./pages/print";

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import { DataProvider } from "./components/DataContext";
import { SettingsProvider } from "./models/settings";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

import "./utils/i18next";

// Remove the convert function if using the Component export convention
function convert(m: any) {
  const {
    loader,
    action,
    default: Component,
    ...rest
  } = m;
  return {
    ...rest,
    loader,
    action,
    Component
  };
}

const router = createHashRouter([
  {
    path: "/",
    lazy: () => import("./routes/root").then(convert),
  },
  {
    lazy: () => import("./routes/app-layout").then(convert),
    children: [
      {
        path: "game",
        lazy: () => import("./routes/game").then(convert),
        children: [
          {
            index: true,
            lazy: () => import("./routes/game.index").then(convert),
          },
          {
            path: "draft",
            lazy: () => import("./routes/game.draft").then(convert),
          },
          {
            path: "draft/play",
            lazy: () => import("./routes/game.play").then(convert),
          },
        ],
      },
      {
        path: "library",
        lazy: () => import("./routes/library").then(convert),
        children: [
          { index: true, lazy: () => import("./routes/library.index").then(convert) },
          { path: "gameplans", lazy: () => import("./routes/library.gameplans").then(convert) },
          { path: "refcards", lazy: () => import("./routes/library.refcards").then(convert) },
          { path: ":guild", lazy: () => import("./routes/library.guild").then(convert) },
        ]
      },
      {
        path: "print",
        lazy: () => import("./routes/print").then(convert),
      },
      {
        path: "settings",
        lazy: () => import("./routes/settings").then(convert),
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode> // Uncomment if needed
  <SettingsProvider>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </SettingsProvider>
  // </React.StrictMode>
);

