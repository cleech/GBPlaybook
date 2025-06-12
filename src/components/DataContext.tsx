import { use, ReactNode } from "react";
import { GBDatabase } from "../models/gbdbTypes";
import { Manifest, Gameplan } from "./DataTypes";
import { DataContext } from "../utils/contexts";
import { initializeAppData } from "./appData";

export interface DataContextProps {
  manifest?: Manifest;
  version: number;
  gameplans?: Gameplan[];
  gameplanYear?: number;
  gbdb?: GBDatabase;
}

interface DataProviderProps {
  children: ReactNode;
}

let dataPromise: Promise<DataContextProps>;

function fetchData(): Promise<DataContextProps> {
  dataPromise = dataPromise ?? initializeAppData();
  return dataPromise;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const dataContextValue = use(fetchData());
  return (
    <DataContext value={dataContextValue}>
      {children}
    </DataContext>
  );
};
