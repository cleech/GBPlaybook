import { PropsWithChildren, useEffect, useState } from "react";
import { RxLocalDocument } from "rxdb";
import { GBDatabase, getGBDatabase } from "./gbdb";
import { Observable } from "rxjs";
import { SettingsContext } from "../utils/contexts";
import { defaultSettings } from "./defaultSettings";

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
    improveReadability: boolean;
  };
  gamePlayRoute: string;
  libraryRoute: string;
  // auto switch on new major release
  mostRecentErrata?: string;
}

export type SettingsDoc = RxLocalDocument<GBDatabase, Settings>;

export interface SettingsContextData {
  setting$?: Observable<SettingsDoc | null>;
}

export const SettingsProvider = (props: PropsWithChildren) => {
  const [setting$, setSetting$] = useState<Observable<SettingsDoc | null> | undefined>();
  const [gbdb, setGBDB] = useState<GBDatabase | undefined>();

  useEffect(() => {
    const getDB = async () => {
      const db = await getGBDatabase();
      setGBDB(db);
      const setting$ = db.getLocal$<Settings>("settings");
      setSetting$(setting$);
    };
    getDB();
    return () => {
      setGBDB(undefined);
      setSetting$(undefined);
    };
  }, []);

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
  }, [gbdb, setting$]);

  return (
    <SettingsContext.Provider value={{ setting$ }}>
      {props.children}
    </SettingsContext.Provider>
  );
};
