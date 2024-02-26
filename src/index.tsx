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

import { FirebaseProvider } from "./services/firebase";
import { RTCProvider } from "./services/webrtc";
import { SettingsProvider } from "./models/settings";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        // FIXME
        // element={<Navigate to={settings.initialScreen} replace />}
        element={<Navigate to="/game" replace />}
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
  <React.StrictMode>
    <FirebaseProvider>
      <RTCProvider>
        <DataProvider>
          <SettingsProvider>
            <RouterProvider router={router} />
          </SettingsProvider>
        </DataProvider>
      </RTCProvider>
    </FirebaseProvider>
  </React.StrictMode>
);
