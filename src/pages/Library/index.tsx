import {
  useRef,
  useEffect,
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

  useEffect(() => {
    if (!setting$) return;
    const patchRoute = () => {
      firstValueFrom(setting$)
        .then((settingsDoc) =>
          settingsDoc?.incrementalPatch({
            libraryRoute: `${location.pathname}?m=${slideRef.current}`,
          })
        )
        .catch(console.error);
    };
    patchRoute();
    return patchRoute
  }, [location, setting$]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        height: "100%",
      }}
    >
      <Outlet context={{ slideRef }} />
    </main>
  );
}