import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, SxProps } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GBSetupSteps } from "../../models/gbdb";
import { firstValueFrom, map } from "rxjs";
import { useNetworkState } from "../../hooks/useNetworkState";
import { useGameState } from "../../hooks/useGameState";
import { stepToNav } from "./utils";

import "./NavigateFab.css";
import "./wacky.css";

interface NavigateFabProps {
  disabled: boolean;
  dest: GBSetupSteps;
  onAction?: () => void;
  sx?: SxProps;
}
export function NavigateFab(props: NavigateFabProps) {
  const navigate = useNavigate();
  const { gameState1$, gameState2$ } = useGameState();
  const { active: networkActive } = useNetworkState();
  const [dest1, setDest1] = useState<GBSetupSteps>();
  const [dest2, setDest2] = useState<GBSetupSteps>();
  const [animate, setAnimate] = useState(false);

  const { dest, onAction, ...otherProps } = props;

  useEffect(() => {
    const sub1 = gameState1$
      ?.pipe(map((doc) => doc?.navigateTo))
      .subscribe((d) => setDest1(d));
    const sub2 = gameState2$
      ?.pipe(map((doc) => doc?.navigateTo))
      .subscribe((d) => setDest2(d));
    return () => {
      sub1?.unsubscribe();
      sub2?.unsubscribe();
    };
  }, [gameState1$, gameState2$]);

  useEffect(() => {
    const doit = async () => {
      await firstValueFrom(gameState1$).then((doc) => {
        doc?.incrementalPatch({ navigateTo: undefined }).catch(console.error);
      });
      if (!networkActive) {
        await firstValueFrom(gameState2$).then((doc) => {
          doc?.incrementalPatch({ navigateTo: undefined }).catch(console.error);
        });
      }
      navigate(stepToNav(dest));
    };
    if (dest1 == dest && dest2 === dest) {
      doit();
    }
  }, [
    gameState1$,
    gameState2$,
    dest,
    dest1,
    dest2,
    networkActive,
    navigate,
    onAction,
  ]);

  // animate when the other side is waiting
  useEffect(() => {
    setAnimate(dest2 ? true : false);
  }, [dest2]);

  return (
    <Fab
      className={animate ? "fabAnimate" : undefined}
      {...otherProps}
      color="secondary"
      onClick={() => {
        onAction?.();
        firstValueFrom(gameState1$).then((doc) => {
          doc?.incrementalPatch({ navigateTo: dest }).catch(console.error);
        });
        if (!networkActive) {
          firstValueFrom(gameState2$).then((doc) => {
            doc?.incrementalPatch({ navigateTo: dest }).catch(console.error);
          });
        }
      }}
    >
      <PlayArrowIcon fontSize="large" sx={{ zIndex: 10 }} />
    </Fab>
  );
}
