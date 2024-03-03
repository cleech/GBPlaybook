import { useState } from "react";
import { Outlet } from "react-router-dom";
// import { IconButton } from "@mui/material";
import { Box } from "@mui/material";
// import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
// import SyncIcon from "@mui/icons-material/Sync";
// import { map } from "rxjs";

import { AppBarContent, AppBarContext } from "../../App";
// import Lobby from "../../components/Lobby";
import OddsCalc from "../../components/Calc";
// import { useRTC } from "../../services/webrtc";
// import { Offline, Online } from "react-detect-offline";
// import { useSettings } from "../../hooks/useSettings";
// import { SettingsDoc } from "../../models/settings";

// const LoginButton = () => {
//   const [showDialog, setShowDialog] = useState(false);
//   const { setting$ } = useSettings();
//   const { dc } = useRTC();

//   const [networkPlay, setNetworkPlay] = useState<boolean>(false);
//   useEffect(() => {
//     const sub = setting$
//       ?.pipe(map((s) => s?.toJSON().data.networkPlay))
//       .subscribe((np) => setNetworkPlay(np ?? false));

//     return () => {
//       sub?.unsubscribe();
//     };
//   });

//   return networkPlay ? (
//     <>
//       <Lobby open={showDialog} onClose={() => setShowDialog(false)} />
//       <Online polling={false}>
//         <IconButton
//           size="small"
//           onClick={() => setShowDialog(true)}
//           disabled={!!dc}
//         >
//           <SyncIcon color={dc ? "success" : "inherit"} />
//         </IconButton>
//       </Online>
//       <Offline polling={false}>
//         <IconButton size="small" disabled>
//           <SyncDisabledIcon />
//         </IconButton>
//       </Offline>
//     </>
//   ) : null;
// };

export default function GamePlay() {
  // const location = useLocation();
  // const { setting$ } = useSettings();
  // const [settingsDoc, setSettingsDoc] = useState<SettingsDoc | null>();
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);

  // useEffect(() => {
  //   const sub = setting$?.subscribe((s) => setSettingsDoc(s));
  //   return () => sub?.unsubscribe();
  // }, [setting$]);

  // useEffect(() => {
  //   return () => {
  //     settingsDoc?.incrementalPatch({
  //       gamePlayRoute: `${location.pathname}${location.search}`,
  //     });
  //   };
  // }, [location, settingsDoc]);

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
        {/* <LoginButton /> */}
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
