import { useState, useEffect } from "react";
import { useData } from "./useData";
import { GBDatabase } from "../models/gbdbTypes";

export function useGBData<T>(
  fetch: (db: GBDatabase) => Promise<T>
): T | undefined {
  const { gbdb: db } = useData();
  const [data, setData] = useState<T>();
  useEffect(() => {
    let canceled = false;
    if (!db) {
      return;
    }
    const fn = async () => {
      const response = await fetch(db);
      if (!canceled) {
        setData(response);
      }
    };
    fn().catch(console.error);
    return () => {
      canceled = true;
    };
  }, [db, fetch]);
  return data;
}
