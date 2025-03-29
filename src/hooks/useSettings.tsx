import { useContext } from "react";
import { Settings, SettingsContext } from "../models/settings";

export const useSettings = () => useContext(SettingsContext);

export const defaultSettings: Settings = {
  dataSet: "GB-Playbook-4-6.json",
  language: "auto",
  initialScreen: "/game",
  gameSize: 6,
  networkPlay: false,
  uiPreferences: { displayStatLine: false },
  cardPreferences: {
    preferredStyle: "sfg",
    improveReadability: false,
  },
  gamePlayRoute: "/game",
  libraryRoute: "/library",
};
