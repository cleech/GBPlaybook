import { useCallback, useEffect, useState } from "react";
import { RxDocument, RxQuery } from "rxdb";
import { useData } from "./useData";
import { GBDatabase } from "../models/gbdb";
import { first } from "rxjs";

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

export function useRxQueryFirst<T>(
  query: (db: GBDatabase) => RxQuery<T>
): RxDocument<T> | undefined {
  const { gbdb: db } = useData();
  const [result, setResult] = useState<RxDocument<T>>();
  useEffect(() => {
    if (!db || !query) {
      return;
    }
    const sub = query(db)
      .$.pipe(first((x) => Boolean(x)))
      .subscribe((result) => {
        setResult(result);
      });
    return () => {
      sub.unsubscribe();
    };
  }, [db, query]);
  return result;
}

export function useRxData<T>(
  query: (db: GBDatabase) => Promise<T>,
  deps?: React.DependencyList
): T | undefined {
  const { gbdb: db } = useData();
  const _query = useCallback(query, deps ?? []);
  const [data, setData] = useState<T>();
  useEffect(() => {
    let cancled = false;
    if (!db) {
      return;
    }
    const fetchData = async () => {
      const _data = await _query(db);
      if (!cancled) {
        setData(_data);
      }
    };
    fetchData().catch(console.error);
    return () => {
      cancled = true;
    };
  }, [db, _query, setData]);
  // return [data, setData];
  return data;
}
