import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, SxProps } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GBSetupSteps } from "../../models/gbdb";
import { firstValueFrom, map } from "rxjs";
import { useNetworkState } from "../../components/onlineSetup";
import { useGameState } from "../../hooks/useGameState";
import { stepToNav } from ".";

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
    if (dest1 == dest && dest2 === dest) {
      firstValueFrom(gameState1$).then((doc) => {
        doc?.incrementalPatch({ navigateTo: undefined }).catch(console.error);
      });
      if (!networkActive) {
        firstValueFrom(gameState2$).then((doc) => {
          doc?.incrementalPatch({ navigateTo: undefined }).catch(console.error);
        });
      }
      navigate(stepToNav(dest));
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

  return (
    <Fab
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
      <PlayArrowIcon />
    </Fab>
  );
}
