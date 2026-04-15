import "./index.css";
// import here to enable web-component, component tag is used in index.html
import "@khmyznikov/pwa-install"
import { registerSW } from "virtual:pwa-register";
import { getSettings } from "./models/settings";
const updateServiceWorker = registerSW({
  immediate: true,
  async onNeedRefresh() {
    console.log("New content available, saving state before reload...");
    try {
      const setting$ = await getSettings();
      const settingsDoc = await firstValueFrom(setting$.pipe(filter((s) => s !== null)));
      if (settingsDoc) {
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath.startsWith("/library")) {
          await settingsDoc.incrementalPatch({ libraryRoute: currentPath });
        } else if (currentPath.startsWith("/game")) {
          await settingsDoc.incrementalPatch({ gamePlayRoute: currentPath });
        }
      }
    } catch (err) {
      console.error("Failed to save state before SW reload:", err);
    }
    updateServiceWorker(true);
  },
});

import '@fontsource/comfortaa';
import './fonts/Calluna-Regular/stylesheet.css';
import '@fontsource/im-fell-great-primer-sc';
import '@fontsource/im-fell-great-primer';
// import '@fontsource/noto-sans-symbols-2';
import '@fontsource/noto-serif-sc';

import { lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLoaderData,
} from "react-router-dom";

import { filter, firstValueFrom } from "rxjs";

import App from "./pages/App";
const AppContent = lazy(() => import("./pages/AppContent"));

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
const DataScreen = lazy(() => import("./pages/DataTable"));

import type { SettingsDoc } from "./models/settings";
import { defaultSettings } from "./models/defaultSettings";

import "./utils/i18next";
import { reSort } from "./utils/reSort";
import LoadingSplash from "./components/LoadingSplash";
import { GBDatabase } from "./models/gbdbTypes";

async function sortedGuilds(db: GBDatabase) {
  const guilds = await db.guilds.find().exec();
  const settings = await db.getLocal<SettingsDoc>("settings");
  const listOrder = settings?.get("customListOrder") ?? [];
  reSort(guilds, "name", listOrder);
  return guilds;
}

const router = createBrowserRouter(
  [{
    element: <App />,
    children: [{
      element: <AppContent />,
      id: "settings",
      lazy: {
        loader: async () => {
          const getSettings = (await import("./models/settings")).getSettings;
          return async () => {
            return await getSettings();
          }
        },
      },
      hydrateFallbackElement: <LoadingSplash />,
      children: [
        {
          path: "/",
          lazy: {
            loader: async () => {
              const getSettings = (await import("./models/settings")).getSettings;
              return async () => {
                const setting$ = await getSettings();
                const settingsDoc = await firstValueFrom(setting$.pipe(filter((s) => s !== null)));
                const initialScreen: string =
                  settingsDoc?.get("initialScreen") ?? defaultSettings.initialScreen;

                let targetRoute = initialScreen;

                if (initialScreen === "/game") {
                  targetRoute = settingsDoc?.get("gamePlayRoute") ?? initialScreen;
                } else if (initialScreen === "/library") {
                  targetRoute = settingsDoc?.get("libraryRoute") ?? initialScreen;
                }
                return targetRoute;
              }
            },
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
              lazy: {
                loader: async () => {
                  const initializeAppData = (await import("./components/appData")).initializeAppData;
                  return async () => {
                    const { gbdb: db } = await initializeAppData();
                    return await sortedGuilds(db);
                  }
                },
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
              lazy: {
                loader: async () => {
                  const initializeAppData = (await import("./components/appData")).initializeAppData;
                  return async () => {
                    const { gbdb: db } = await initializeAppData();
                    return await sortedGuilds(db);
                  }
                },
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
                  lazy: {
                    loader: async () => {
                      const initializeAppData = (await import("./components/appData")).initializeAppData;
                      return async ({ params }) => {
                        const { gbdb: db } = await initializeAppData();
                        const [guild, _roster] = await Promise.all([
                          db.guilds.findOne().where({ name: params.guild }).exec(),
                          db.models.find().or([{ guild1: params.guild }, { guild2: params.guild }]).exec(),
                        ]);
                        reSort(_roster, "id", guild ? guild.roster : []);
                        const roster = await Promise.all(_roster.map((m) => m.expand()));
                        return { guild, roster };
                      }
                    },
                  },
                  hydrateFallbackElement: <LoadingSplash />,
                },
              ]
            },
          ]
        },
        {
          path: "print", element: <CardPrintScreen />,
          lazy: {
            loader: async () => {
              const initializeAppData = (await import("./components/appData")).initializeAppData;
              return async () => {
                const { gbdb: db } = await initializeAppData();
                return await sortedGuilds(db);
              }
            }
          }
        },
        {
          path: "data", element: <DataScreen />,
          lazy: {
            loader: async () => {
              const initializeAppData = (await import("./components/appData")).initializeAppData;
              return async () => {
                const { gbdb: db } = await initializeAppData();
                const _models = await db.models.find().exec();
                const models = await Promise.all(_models.map((m) => m.expand()));
                return models;
              }
            }
          }
        },
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
