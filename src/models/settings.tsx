import {
  createContext,
  useContext,
  PropsWithChildren,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useData } from "../components/DataContext";
import { RxLocalDocument } from "rxdb";
import { GBDatabase } from "./gbdb";

interface Settings {
  dataSet?: string;
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
}

const defaultSettings: Settings = {
  initialScreen: "/game",
  gameSize: 6,
  networkPlay: false,
  uiPreferences: { displayStatLine: false },
  cardPreferences: { preferredStyle: "gbcp" },
  gamePlayRoute: "/game",
  libraryRoute: "/library",
};

export type SettingsDoc = RxLocalDocument<GBDatabase, Settings>;

interface SettingsContextData {
  settings: Settings;
  settingsDoc?: SettingsDoc;
}

const SettingsContext = createContext<SettingsContextData>({
  settings: defaultSettings,
});

export const SettingsProvider = (props: PropsWithChildren) => {
  const { gbdb: db } = useData();
  const setting$ = useMemo(() => db?.getLocal$<Settings>("settings"), [db]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsDoc, setSettingsDoc] = useState<SettingsDoc>();

  useEffect(() => {
    if (!setting$) {
      return;
    }
    const observer = setting$.subscribe((s) => {
      if (!s) {
        db?.upsertLocal<Settings>("settings", defaultSettings).catch(
          console.error
        );
        return;
      }
      setSettings(s.toJSON().data);
      setSettingsDoc(s);
    });
    return () => observer.unsubscribe();
  }, [setting$]);
  return (
    <SettingsContext.Provider
      value={{ settings: settings, settingsDoc: settingsDoc }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
