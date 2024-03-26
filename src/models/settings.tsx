import { createContext, PropsWithChildren, useEffect, useMemo } from "react";
import { RxLocalDocument } from "rxdb";
import gbdb, { GBDatabase } from "./gbdb";
import { Observable } from "rxjs";
import { defaultSettings } from "../hooks/useSettings";

export interface Settings {
  dataSet?: string;
  language?: string;
  initialScreen: string;
  gameSize: 3 | 4 | 6;
  networkPlay: boolean;
  uiPreferences: {
    displayStatLine: boolean;
  };
  cardPreferences: {
    preferredStyle: "sfg" | "gbcp";
  };
  gamePlayRoute: string;
  libraryRoute: string;
  // auto switch on new major release
  mostRecentErrata?: string;
}

export type SettingsDoc = RxLocalDocument<GBDatabase, Settings>;

interface SettingsContextData {
  setting$?: Observable<SettingsDoc | null>;
  // settings: Settings;
  // settingsDoc?: SettingsDoc;
}

export const SettingsContext = createContext<SettingsContextData>({
  // settings: defaultSettings,
});

export const SettingsProvider = (props: PropsWithChildren) => {
  const setting$ = useMemo(() => gbdb.getLocal$<Settings>("settings"), []);

  useEffect(() => {
    if (!setting$) {
      return;
    }
    const sub = setting$.subscribe((s) => {
      if (!s) {
        gbdb
          ?.upsertLocal<Settings>("settings", defaultSettings)
          .catch(console.error);
        return;
      }
    });
    return () => sub.unsubscribe();
  }, [setting$]);

  return (
    <SettingsContext.Provider value={{ setting$ }}>
      {props.children}
    </SettingsContext.Provider>
  );
};
