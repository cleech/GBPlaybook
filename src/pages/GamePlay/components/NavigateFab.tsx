import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, SxProps } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { css, keyframes } from '@emotion/css';
import { firstValueFrom, map } from "rxjs";

import { GBSetupSteps } from "../../../models/gbdbTypes";
import { useNetworkState } from "../../../hooks/useNetworkState";
import { useGameState } from "../../../hooks/useGameState";

const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1.4) rotate(0turn);
  }
  to {
    transform: translate(-50%, -50%) scale(1.4) rotate(1turn);
  }
`;

const animateCss = css`
  --offset: 5px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    background: conic-gradient(transparent, darkred 280deg, transparent);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    width: 100%;
    animation: ${rotate} 2s linear infinite;
  }

  &::after {
    content: "";
    background: inherit;
    border-radius: inherit;
    position: absolute;
    inset: var(--offset);
    height: calc(100% - 2 * var(--offset));
    width: calc(100% - 2 * var(--offset));
  }
`;

function stepToNav(step: GBSetupSteps) {
  switch (step) {
    case "Guilds":
      return "/game";
    case "Draft":
      return "/game/draft";
    case "Game":
      return "/game/draft/play";
  }
}

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
    setAnimate(dest2 === dest ? true : false);
  }, [dest, dest2]);

  return (
    <Fab
      className={animate ? animateCss : undefined}
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
