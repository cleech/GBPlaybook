import { useEffect, useState } from "react";
import { RxDocument, RxQuery } from "rxdb";
import { useData } from "./DataContext";
import { GBDatabase } from "../models/gbdb";

export function useRxQuery<T>(
  query: (db: GBDatabase) => RxQuery<T>
): RxDocument<T>[] | undefined {
  const { gbdb: db } = useData();
  const [result, setResult] = useState<RxDocument<T>[]>();
  useEffect(() => {
    if (!db || !query) {
      return;
    }
    const sub = query(db).$.subscribe((result) => {
      setResult(result);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [db, query]);
  return result;
}
