import {
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  Outlet,
  useSearchParams,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";

import { firstValueFrom, Observable } from "rxjs";
import { SettingsDoc } from "../../models/settings";
import { Box } from "@mui/material";
import { AppBarContent } from "../App";
import { AppBarContext } from "../../utils/contexts";
import OddsCalc from "../GamePlay/components/Calc";

export default function Library() {
  const location = useLocation();
  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
  const [searchParams] = useSearchParams();
  const slideRef = useRef<number>(
    Number.parseInt(searchParams.get("m") ?? "0") || 0
  );

  const [appBarContainer, setContainer] = useState<HTMLElement>();

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
      <AppBarContent>
        <Box ref={(el: HTMLElement) => setContainer(el)}
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: 'space-between',
          }}
        />
        <OddsCalc />
      </AppBarContent>
      <AppBarContext value={appBarContainer}>
        <Outlet context={{ slideRef }} />
      </AppBarContext>
    </main>
  );
}
