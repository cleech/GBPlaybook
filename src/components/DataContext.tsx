import { useState, useEffect, ReactNode } from "react";
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

export const DataProvider = ({ children }: DataProviderProps) => {
  const [dataContextValue, setDataContextValue] = useState<DataContextProps>({
    manifest: undefined,
    version: 0,
    gameplans: undefined,
    gbdb: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    const loadAppData = async () => {
      setIsLoading(true);
      try {
        const initializedData = await initializeAppData();
        if (!canceled) {
          setDataContextValue(initializedData);
        }
      } catch (error) {
        console.error("Failed to initialize application data in DataProvider:", error);
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    };
    loadAppData();
    return () => {
      canceled = true;
    };
  }, []); // Run once on mount

  if (isLoading) {
    // You might want to render a loading spinner or null here
    return;
  }

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
};