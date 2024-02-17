import { useEffect, useState } from "react";
import { RxDocument, RxQuery } from "rxdb";

export function useRxQuery<T>(query: RxQuery<T>): RxDocument<T>[] {
  const [result, setResult] = useState<RxDocument<T>[]>([]);
  useEffect(() => {
    const sub = query.$.subscribe((result) => {
      setResult(result);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [query]);
  return result;
}
