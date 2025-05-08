// import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App";

import {
  createHashRouter,
  RouterProvider,
  Navigate,
  useLoaderData,
} from "react-router-dom";
import GamePlay, { TeamSelect, Draft, Game } from "./pages/GamePlay";
import Library, {
  GamePlans,
  GuildList,
  RefCards,
  Roster,
} from "./pages/library";
import Settings from "./pages/settings";

import { CardPrintScreen } from "./pages/print";

import { SettingsDoc } from "./models/settings";
import { defaultSettings } from "./models/defaultSettings";

import { getGBDatabase } from "./models/gbdb";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

import "./utils/i18next";
import { reSort } from "./utils/reSort";

const router = createHashRouter(
  [
    {
      element: <App />,
      children: [
        {
          path: "/",
          loader: async () => {
            const gbdb = await getGBDatabase();
            const settings = await gbdb.getLocal<SettingsDoc>("settings");
            const initialScreen: string =
              settings?.get("initialScreen") ?? defaultSettings.initialScreen;

            let targetRoute = initialScreen;

            if (initialScreen === "/game") {
              targetRoute = settings?.get("gamePlayRoute") ?? initialScreen;
            } else if (initialScreen === "/library") {
              targetRoute = settings?.get("libraryRoute") ?? initialScreen;
            }
            return targetRoute;
          },
          Component: () => {
            const target = useLoaderData<string>();
            return <Navigate to={target} replace />
          },
          // hydrateFallbackElement: <div>Loading ...</div>,
        },
        {
          element: <GamePlay />,
          children: [
            {
              path: "game",
              element: <TeamSelect />,
              loader: async () => {
                const db = await getGBDatabase();
                return await db.guilds.find().exec();
              },
              // hydrateFallbackElement: <div>Loading ...</div>,
            },
            { path: "game/draft", element: <Draft /> },
            { path: "game/draft/play", element: <Game /> },
          ]
        },
        {
          path: "library", element: <Library />,
          children: [
            {
              index: true,
              element: <GuildList />,
              loader: async () => {
                const db = await getGBDatabase();
                return await db.guilds.find().exec();
              },
              // hydrateFallbackElement: <div>Loading ...</div>,
            },
            { path: "gameplans", element: <GamePlans /> },
            { path: "refcards", element: <RefCards /> },
            {
              path: ":guild",
              element: <Roster />,
              loader: async ({ params }) => {
                const db = await getGBDatabase();
                const [guild, _roster] = await Promise.all([
                  db.guilds.findOne().where({ name: params.guild }).exec(),
                  db.models.find().or([{ guild1: params.guild }, { guild2: params.guild }]).exec(),
                ]);
                reSort(_roster, "id", guild ? guild.roster : []);
                const roster = await Promise.all(_roster.map((m) => m.expand()));
                return { guild, roster };
              },
              // hydrateFallbackElement: <div>Loading ...</div>,
            },
          ]
        },
        { path: "print", element: <CardPrintScreen /> },
        { path: "settings", element: <Settings /> },
      ]
    }
  ]
);

const root = createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode >
);
