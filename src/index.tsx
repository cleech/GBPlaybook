import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createHashRouter,
  RouterProvider,
  Navigate,
  useLoaderData,
} from "react-router-dom";

import App, { AppContent } from "./pages/App";

const GamePlay = lazy(() => import("./pages/GamePlay"));
const TeamSelect = lazy(() => import("./pages/GamePlay/TeamSelect"));
const Draft = lazy(() => import("./pages/GamePlay/Draft"));
const Game = lazy(() => import("./pages/GamePlay/Game"));

const Library = lazy(() => import("./pages/Library"));
const LibraryCarousel = lazy(() => import("./pages/Library/LibraryCarousel"));
const GamePlans = lazy(() => import("./pages/Library/GamePlans"));
const GuildList = lazy(() => import("./pages/Library/GuildList"));
const RefCards = lazy(() => import("./pages/Library/RefCards"));
const Roster = lazy(() => import("./pages/Library/Roster"));

const Settings = lazy(() => import("./pages/Settings"));
const CardPrintScreen = lazy(() => import("./pages/Print"));

import { getSettings, SettingsDoc } from "./models/settings";
import { defaultSettings } from "./models/defaultSettings";

import { getGBDatabase } from "./models/gbdb";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

import "./utils/i18next";
import { reSort } from "./utils/reSort";
import { initializeAppData } from "./components/appData";
import LoadingSplash from "./components/LoadingSplash";

const router = createHashRouter(
  [{
    element: <App />,
    children: [{
      element: <AppContent />,
      id: "settings",
      loader: async () => {
        return await getSettings();
      },
      hydrateFallbackElement: <LoadingSplash />,
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
          hydrateFallbackElement: <LoadingSplash />,
          Component: () => {
            const target = useLoaderData<string>();
            return <Navigate to={target} replace />
          },
        },
        {
          element: <GamePlay />,
          children: [
            {
              path: "game",
              element: <TeamSelect />,
              loader: async () => {
                const { gbdb: db } = await initializeAppData();
                return await db.guilds.find().exec();
              },
              hydrateFallbackElement: <LoadingSplash />,
            },
            { path: "game/draft", element: <Draft />, },
            { path: "game/draft/play", element: <Game />, },
          ]
        },
        {
          path: "library",
          element: <Library />,
          children: [
            {
              index: true,
              element: <GuildList />,
              loader: async () => {
                const { gbdb: db } = await initializeAppData();
                return await db.guilds.find().exec();
              },
              hydrateFallbackElement: <LoadingSplash />,
            },
            {
              element: <LibraryCarousel />,
              children: [
                { path: "gameplans", element: <GamePlans /> },
                { path: "refcards", element: <RefCards /> },
                {
                  path: ":guild",
                  element: <Roster />,
                  loader: async ({ params }) => {
                    const { gbdb: db } = await initializeAppData();
                    const [guild, _roster] = await Promise.all([
                      db.guilds.findOne().where({ name: params.guild }).exec(),
                      db.models.find().or([{ guild1: params.guild }, { guild2: params.guild }]).exec(),
                    ]);
                    reSort(_roster, "id", guild ? guild.roster : []);
                    const roster = await Promise.all(_roster.map((m) => m.expand()));
                    return { guild, roster };
                  },
                  hydrateFallbackElement: <LoadingSplash />,
                },
              ]
            },
          ]
        },
        { path: "print", element: <CardPrintScreen /> },
        { path: "settings", element: <Settings /> }
      ]
    }]
  }]
);

const root = createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode >
);
