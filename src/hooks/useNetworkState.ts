import { useEffect, useMemo, useState } from "react";
import { useData } from "./useData";
import { RxLocalDocument } from "rxdb";

interface NetworkLocalState {
  uid: string;
  oid: string;
  gid: string;
}

export function useNetworkState() {
  const { gbdb: db } = useData();
  const [active, setActive] = useState(false);
  const [state, setState] = useState<RxLocalDocument<NetworkLocalState>>();

  const network$ = useMemo(() => db?.game_state.getLocal$("network"), [db]);
  useEffect(() => {
    if (!network$) {
      return;
    }
    const sub = network$.subscribe((doc) => {
      if (doc && !doc.deleted) {
        setState(doc);
        setActive(true);
      } else {
        setState(undefined);
        setActive(false);
      }
    });
    return () => sub.unsubscribe();
  }, [network$]);
  return { active: active, netDoc: state };
}
