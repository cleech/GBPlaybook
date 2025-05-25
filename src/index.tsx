import { createRoot } from "react-dom/client";
import "./index.css";
import App, { AppContent } from "./pages/App";

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
} from "./pages/Library";
import Settings from "./pages/Settings";

import { CardPrintScreen } from "./pages/Print";

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
