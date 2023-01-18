import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import GamePlay, { TeamSelect, Draft, Game } from "./routes/gameplay";
import Library, { GuildList, Roster } from "./routes/library";
import Settings from "./routes/settings";

import { DataProvider } from "./components/DataContext";
import {
  rootStore,
  rootStorePersist,
  Provider as RootStoreProvider,
} from "./models/Root";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

rootStorePersist().then(() =>
  root.render(
    <React.StrictMode>
      <RootStoreProvider value={rootStore}>
        <DataProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/game" replace />} />
              <Route element={<App />}>
                <Route element={<GamePlay />}>
                  <Route path="game" element={<TeamSelect />} />
                  <Route path="game/draft" element={<Draft />} />
                  <Route path="game/draft/play" element={<Game />} />
                </Route>
                <Route path="library" element={<Library />}>
                  <Route index element={<GuildList />} />
                  <Route path=":guild" element={<Roster />} />
                </Route>
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </HashRouter>
        </DataProvider>
      </RootStoreProvider>
    </React.StrictMode>
  )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
