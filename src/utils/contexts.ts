import { createContext } from "react";
import { DataContextProps } from "../components/DataContext";
import { SettingsContextData } from "../models/settings";

export const AppBarContext = createContext<HTMLElement | null>(null);

export const DataContext = createContext<DataContextProps>({
  manifest: undefined,
  version: 0,
  gameplans: undefined,
});

export const SettingsContext = createContext<SettingsContextData>({
  // settings: defaultSettings,
});

