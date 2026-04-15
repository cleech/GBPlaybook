import { RxLocalDocument } from "rxdb";
import { GBDatabase } from "./gbdbTypes";
import { getGBDatabase } from "./gbdb";
import { Observable } from "rxjs";
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
  customListOrder?: string[];
}

export type SettingsDoc = RxLocalDocument<GBDatabase, Settings>;

let settingsInitPromise: Promise<Observable<SettingsDoc | null>> | undefined;
import.meta.hot?.dispose(() => {
  settingsInitPromise = undefined;
});

export async function getSettings(): Promise<Observable<SettingsDoc | null>> {
  if (settingsInitPromise) return settingsInitPromise;
  settingsInitPromise = (async () => {
    const db = await getGBDatabase();
    try {
      await db.insertLocal("settings", defaultSettings);
    } catch (err) {
      // If it already exists, that's fine.
    }
    return db.getLocal$<Settings>("settings");
  })();
  return settingsInitPromise;
}
