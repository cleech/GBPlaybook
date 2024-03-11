import { useContext } from "react";
import { SettingsContext } from "../models/settings";
import { Settings } from "../models/settings";

export const useSettings = () => useContext(SettingsContext);

export const defaultSettings: Settings = {
  dataSet: "GB-Playbook-4-5.json",
  initialScreen: "/game",
  gameSize: 6,
  networkPlay: false,
  uiPreferences: { displayStatLine: false },
  cardPreferences: { preferredStyle: "gbcp" },
  gamePlayRoute: "/game",
  libraryRoute: "/library",
};
