import { Settings } from "./settings";


export const defaultSettings: Settings = {
  dataSet: "GB-Playbook-4-7.json",
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
