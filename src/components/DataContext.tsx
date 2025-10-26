import { useState, useEffect, ReactNode } from "react";
import { GBDatabase } from "../models/gbdbTypes";
import { Manifest, Gameplan } from "./DataTypes";
import { DataContext } from "../utils/contexts";
import { initializeAppData } from "./appData";

export interface DataContextProps {
  reloadData: () => Promise<void>;
  manifest?: Manifest;
  version: number;
  gameplans?: Gameplan[];
  gameplanYear?: number;
  gbdb?: GBDatabase;
  lang: string;
}

interface DataProviderProps {
  children: ReactNode;
}

let dataPromise: Promise<DataContextProps> | undefined;
import.meta.hot?.dispose(() => {
  dataPromise = undefined;
});

function fetchData(): Promise<DataContextProps> {
  dataPromise = dataPromise ?? initializeAppData();
  return dataPromise;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<DataContextProps | undefined>();
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  }
  useEffect(() => {
    loadData();
  }, []);
  if (!data) {
    return null;
  }
  return (
    <DataContext value={{
      ...data,
      reloadData: async () => {
        dataPromise = undefined;
        await loadData();
      }
    }}>
      {children}
    </DataContext >
  );
};
