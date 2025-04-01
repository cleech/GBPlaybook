import { useContext } from "react";
import { SettingsContext } from "../utils/contexts";

export const useSettings = () => useContext(SettingsContext);
