import {
  useRef,
  useEffect,
  useCallback,
} from "react";

import {
  Outlet,
  useSearchParams,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";

import { firstValueFrom, Observable } from "rxjs";
import { SettingsDoc } from "../../models/settings";

export default function Library() {
  const location = useLocation();
  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
  const [searchParams] = useSearchParams();
  const slideRef = useRef<number>(
    Number.parseInt(searchParams.get("m") ?? "0") || 0
  );

  const patchRoute = useCallback(async () => {
    if (!setting$) return;
    try {
      const settingsDoc = await firstValueFrom(setting$);
      await settingsDoc?.incrementalPatch({
        libraryRoute: `${location.pathname}?m=${slideRef.current}`,
      });
    } catch (err) {
      console.error(err);
    }
  }, [setting$, location.pathname]);

  useEffect(() => {
    patchRoute();
    return () => { patchRoute(); }
  }, [patchRoute]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Outlet context={{ slideRef }} />
    </main>
  );
}
