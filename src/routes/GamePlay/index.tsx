import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { IconButton, Box } from "@mui/material";
import { useStore } from "../../models/Root";

import { AppBarContent, AppBarContext } from "../../App";

import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";

import Lobby from "../../components/Lobby";
import OddsCalc from "../../components/Calc";
import { useRTC } from "../../services/webrtc";
import { observer } from "mobx-react-lite";
import { Offline, Online } from "react-detect-offline";

const LoginButton = observer(() => {
  const [showDialog, setShowDialog] = useState(false);
  const { settings } = useStore();
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
});

export default function GamePlay() {
  const location = useLocation();
  const { setGamePlayRoute } = useStore();
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setGamePlayRoute(`${location.pathname}${location.search}`);
  }, [location, setGamePlayRoute]);

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
