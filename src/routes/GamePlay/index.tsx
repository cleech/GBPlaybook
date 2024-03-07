import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { AppBarContent, AppBarContext } from "../../App";
import OddsCalc from "../../components/Calc";
import { useNetworkState } from "../../components/onlineSetup";
import { useData } from "../../hooks/useData";
import { GBGameStateDoc } from "../../models/gbdb";
import { Observable, firstValueFrom } from "rxjs";
import { GameContextType } from "../../hooks/useGameState";
// import { useSettings } from "../../hooks/useSettings";
// import { SettingsDoc } from "../../models/settings";

export default function GamePlay() {
  // const location = useLocation();
  // const { setting$ } = useSettings();
  // const [settingsDoc, setSettingsDoc] = useState<SettingsDoc | null>();
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);

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

  const [team1, setTeam1] = useState<Observable<GBGameStateDoc | null>>();
  useEffect(() => {
    const doc$ = db?.game_state.findOne(player1).$;
    setTeam1(doc$);
  }, [db, player1]);

  const [team2, setTeam2] = useState<Observable<GBGameStateDoc | null>>();
  useEffect(() => {
    const doc$ = db?.game_state.findOne(player2).$;
    setTeam2(doc$);
  }, [db, player2]);

  useEffect(() => {
    if (!db) {
      return;
    }
    const populate = async () => {
      if (!team1) {
        return;
      }
      const _team1 = await firstValueFrom(team1);
      if (_team1 === null) {
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
      if (!team2) {
        return;
      }
      const _team2 = await firstValueFrom(team2);
      if (_team2 === null && !networkActive) {
        await db?.game_state.upsert({ _id: player2, roster: [] });
      }
    };
    populate();
  }, [db, team2, player2, networkActive]);

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
              gameState1$: team1,
              gameState2$: team2,
            } as GameContextType
          }
        />
      </AppBarContext.Provider>
    </main>
  );
}

export { default as TeamSelect } from "./TeamSelect";
export { default as Draft } from "./Draft";
export { default as Game } from "./Game";
