import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button, IconButton, Snackbar, Alert, Box } from "@mui/material";
import { useStore } from "../../models/Root";

import { AppBarContent, AppBarContext } from "../../App";

import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";

import Lobby from "../../components/Lobby";
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

  React.useEffect(() => {
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
        <LoginButton />
      </AppBarContent>
      <AppBarContext.Provider value={appBarContainer}>
        <Outlet />
      </AppBarContext.Provider>
    </main>
  );
}

const ResumeSnackBar = () => {
  const { resumePossible } = useStore();
  const [showSnack, setShowSnack] = useState(resumePossible);
  return (
    <Snackbar
      open={showSnack}
      onClose={() => setShowSnack(false)}
      autoHideDuration={6000}
    >
      <Alert
        severity="info"
        action={
          <Button size="small" href="/game/draft/play">
            Resume Game
          </Button>
        }
      >
        There is an existing game that can be resumed.
      </Alert>
    </Snackbar>
  );
};

export { default as TeamSelect } from "./TeamSelect";
export { default as Draft } from "./Draft";
export { default as Game } from "./Game";
