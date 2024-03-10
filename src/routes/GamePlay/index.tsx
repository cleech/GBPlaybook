import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import { AppBarContent, AppBarContext } from "../../App";
import OddsCalc from "../../components/Calc";
import { useNetworkState } from "../../hooks/useNetworkState";
import { useData } from "../../hooks/useData";
import { GBGameStateDoc } from "../../models/gbdb";
import { Observable, firstValueFrom } from "rxjs";
import { GameContextType } from "../../hooks/useGameState";
import { useSettings } from "../../hooks/useSettings";

export default function GamePlay() {
  const location = useLocation();
  const { setting$ } = useSettings();
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!setting$) return;
    return () => {
      firstValueFrom(setting$)
        .then((settingsDoc) =>
          settingsDoc?.incrementalPatch({
            gamePlayRoute: `${location.pathname}${location.search}`,
          })
        )
        .catch(console.error);
    };
  }, [location, setting$]);

  const { gbdb: db } = useData();

  const { active: networkActive, netDoc } = useNetworkState();
  const player1: string = networkActive ? netDoc?.get("uid") : "Player1";
  const player2: string = networkActive ? netDoc?.get("oid") : "Player2";

  // Make sure there is a game state document available
  // Create an empty one if there isn't
  const [team1, setTeam1] = useState<Observable<GBGameStateDoc | null>>();
  useEffect(() => {
    const doc$ = db?.game_state.findOne(player1).$;
    setTeam1(doc$);
    if (!doc$) {
      return;
    }
    let cancel = false;
    const populate = async () => {
      if (cancel) {
        return;
      }
      const _team1 = await firstValueFrom(doc$);
      if (_team1 === null) {
        await db?.game_state.upsert({
          _id: player1,
          roster: [],
          // currentStep: "Guilds",
        });
      }
    };
    populate().catch(console.error);
    return () => {
      cancel = true;
    };
  }, [db, player1]);

  const [team2, setTeam2] = useState<Observable<GBGameStateDoc | null>>();
  useEffect(() => {
    const doc$ = db?.game_state.findOne(player2).$;
    setTeam2(doc$);
    if (!doc$) {
      return;
    }
    let cancel = false;
    const populate = async () => {
      if (cancel) {
        return;
      }
      const _team2 = await firstValueFrom(doc$);
      // Don't create a document for the remote side of a network game
      // Wait for replication to bring it over
      if (_team2 === null && !networkActive) {
        await db?.game_state.upsert({
          _id: player2,
          roster: [],
          // currentStep: "Guilds",
        });
      }
    };
    populate().catch(console.error);
    return () => {
      cancel = true;
    };
  }, [db, player2, networkActive]);

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
