import { createContext } from "react";
import { DataContextProps } from "../components/DataContext";

export const AppBarContext = createContext<HTMLElement | null>(null);

export const DataContext = createContext<DataContextProps>({
  manifest: undefined,
  version: 0,
  gameplans: undefined,
});
