import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Box } from "@mui/material";

import { AppBarContent, AppBarContext } from "../../App";
import OddsCalc from "../../components/Calc";
import { useNetworkState } from "../../components/onlineSetup";
import { useRxData } from "../../hooks/useRxQuery";
import { useData } from "../../hooks/useData";
import { GBGameStateDoc } from "../../models/gbdb";
import { RxLocalDocument } from "rxdb";
// import { useSettings } from "../../hooks/useSettings";
// import { SettingsDoc } from "../../models/settings";

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

  const { gbdb: db } = useData();

  const { active: networkActive, netDoc } = useNetworkState();
  const player1: string = networkActive ? netDoc?.get("uid") : "Player1";
  const player2: string = networkActive ? netDoc?.get("oid") : "Player2";

  // console.log(`network is ${networkActive}`);

  // const [refresh, setRefresh] = useState(0);

  // const team1 = useRxData(
  //   (db) => db.game_state.findOne(player1).exec(),
  //   [player1, refresh]
  // );
  // const team2 = useRxData(
  //   (db) => db.game_state.findOne(player2).exec(),
  //   [player2, refresh, networkActive]
  // );

  const [team1, setTeam1] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    const doc$ = db?.game_state.findOne(player1).$;
    const sub = doc$?.subscribe((doc) => {
      setTeam1(doc);
    });
    return () => sub?.unsubscribe();
  }, [db, player1]);

  const [team2, setTeam2] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    const doc$ = db?.game_state.findOne(player2).$;
    const sub = doc$?.subscribe((doc) => {
      setTeam2(doc);
    });
    return () => sub?.unsubscribe();
  }, [db, player2]);

  useEffect(() => {
    if (!db) {
      return;
    }
    const populate = async () => {
      if (team1 === null) {
        await db?.game_state.upsert({ _id: player1, roster: [] });
      }
    };
    populate();
  }, [db, team1, player1]);

  useEffect(() => {
    if (!db) {
      return;
    }
    const populate = async () => {
      if (team2 === null && !networkActive) {
        await db?.game_state.upsert({ _id: player2, roster: [] });
      }
    };
    populate();
  }, [db, team2, player2, networkActive]);

  // if (!team1 || !team2) {
  //   return null;
  // }

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
      </AppBarContent>
      <AppBarContext.Provider value={appBarContainer}>
        <Outlet
          context={
            {
              // player1,
              gameState1: team1,
              // player2,
              gameState2: team2,
            } as GameContextType
          }
        />
      </AppBarContext.Provider>
    </main>
  );
}

type GameContextType = {
  // player1: string;
  gameState1: GBGameStateDoc;
  // player2: string;
  gameState2: GBGameStateDoc;
};
export function useGameState() {
  return useOutletContext<GameContextType>();
}

export { default as TeamSelect } from "./TeamSelect";
export { default as Draft } from "./Draft";
export { default as Game } from "./Game";
