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
import {
  rootStore,
  rootStorePersist,
  Provider as RootStoreProvider,
} from "./models/Root";
import { CardPrintScreen } from "./routes/print";

import { FirebaseProvider } from "./services/firebase";
import { RTCProvider } from "./services/webrtc";

rootStorePersist().then(() => {
  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Navigate to={rootStore.settings.initialScreen} replace />}
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
          <Route path="settings" element={<Settings />} />
          <Route path="print" element={<CardPrintScreen />} />
        </Route>
      </>
    )
  );
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    // <React.StrictMode>
    <RootStoreProvider value={rootStore}>
      <FirebaseProvider>
        <RTCProvider>
          <DataProvider>
            <RouterProvider router={router} />
          </DataProvider>
        </RTCProvider>
      </FirebaseProvider>
    </RootStoreProvider>
    // </React.StrictMode>
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.register({
//  onUpdate: (registration) => {
//    // console.log(
//    //   `SW update callback, have waiting sw? ${registration.waiting != null}`
//    // );
//  },
//});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
