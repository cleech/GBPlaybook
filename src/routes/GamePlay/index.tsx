import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { IconButton, Box } from "@mui/material";

import { AppBarContent, AppBarContext } from "../../App";

import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";

import Lobby from "../../components/Lobby";
import OddsCalc from "../../components/Calc";
import { useRTC } from "../../services/webrtc";
import { Offline, Online } from "react-detect-offline";
import { useSettings } from "../../models/settings";

const LoginButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { settings } = useSettings();
  const { dc } = useRTC();
  return settings.networkPlay ? (
    <>
      <Lobby open={showDialog} onClose={() => setShowDialog(false)} />
      <Online polling={false}>
        <IconButton
          size="small"
          onClick={() => setShowDialog(true)}
          disabled={!!dc}
        >
          <SyncIcon color={dc ? "success" : "inherit"} />
        </IconButton>
      </Online>
      <Offline polling={false}>
        <IconButton size="small" disabled>
          <SyncDisabledIcon />
        </IconButton>
      </Offline>
    </>
  ) : null;
};

export default function GamePlay() {
  const location = useLocation();
  const { settings, settingsDoc } = useSettings();
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // FIXME: excessive re-renders when we keep changing this
    const route = `${location.pathname}${location.search}`;
    if (route !== settings.gamePlayRoute) {
      settingsDoc?.incrementalPatch({
        gamePlayRoute: `${location.pathname}${location.search}`,
      });
    }
  }, [location, settingsDoc]);

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        display: "flex",
      }}
    >
      <AppBarContent>
        <Box
          ref={(el: HTMLElement) => setContainer(el)}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        />
        <OddsCalc />
        <LoginButton />
      </AppBarContent>
      <AppBarContext.Provider value={appBarContainer}>
        <Outlet />
      </AppBarContext.Provider>
    </main>
  );
}

export { default as TeamSelect } from "./TeamSelect";
export { default as Draft } from "./Draft";
export { default as Game } from "./Game";
