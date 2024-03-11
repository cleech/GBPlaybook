import { useState, useEffect } from "react";
import { useData } from "./useData";
import { GBDatabase } from "../models/gbdb";

export function useGBData<T>(
  fetch: (db: GBDatabase) => Promise<T>
): T | undefined {
  const { gbdb: db } = useData();
  const [data, setData] = useState<T>();
  useEffect(() => {
    let cancled = false;
    if (!db) {
      return;
    }
    const fn = async () => {
      const response = await fetch(db);
      if (!cancled) {
        setData(response);
      }
    };
    fn().catch(console.error);
    return () => {
      cancled = true;
    };
  }, [db, fetch]);
  return data;
}
