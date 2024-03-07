import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import { useBlocker, useNavigate } from "react-router-dom";
import type { BlockerFunction } from "@remix-run/router";
import {
  Button,
  Divider,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Link,
  Breadcrumbs,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import RosterList, { HealthCounter } from "../../components/RosterList";
import { FlipCard } from "../../components/FlipCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import { FlipGuildCard } from "../../components/GuildCard";
import { GBGameStateDoc, GBModelExpanded } from "../../models/gbdb";
import { reSort } from "../../utils/reSort";
import { firstValueFrom, map } from "rxjs";
import { useRxData } from "../../hooks/useRxQuery";
import { useNetworkState } from "../../components/onlineSetup";
import { useGameState } from "../../hooks/useGameState";

export default function Game() {
  const [showSnack, setShowSnack] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      (args) => {
        if (args.nextLocation.pathname.startsWith("/game")) {
          setShowSnack(true);
          return true;
        }
        return false;
      },
      [setShowSnack]
    )
  );

  /* useBlocker doesn't seem to work unless some state is updated */
  useEffect(() => {
    setBlocked(true);
  }, [blocked, setBlocked]);

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <IconButton color="inherit" href={`/game`} size="small">
            <Home />
          </IconButton>
          <Link underline="hover" color="inherit" href={`/game/draft`}>
            Draft
          </Link>
          <Typography>Play</Typography>
        </Breadcrumbs>
      </AppBarContent>

      <GameInner />

      <Snackbar
        open={showSnack}
        onClose={() => setShowSnack(false)}
        autoHideDuration={5000}
      >
        <Alert
          severity="warning"
          action={
            <Button size="small" onClick={blocker.proceed}>
              Exit Game
            </Button>
          }
        >
          Making changes to the team selections will reset the game state.
        </Alert>
      </Snackbar>
    </Box>
  );
}

function GameInner() {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  const navigate = useNavigate();

  const { active: networkActive } = useNetworkState();

  const { gameState1$, gameState2$ } = useGameState();

  const [team1, setGameState1] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    if (!gameState1$) {
      return;
    }
    let canceled = false;
    const snapshot = async () => {
      const doc = await firstValueFrom(gameState1$);
      if (!canceled) {
        setGameState1(doc);
      }
    };
    snapshot();
    return () => {
      canceled = true;
    };
  }, [gameState1$]);

  const [team2, setGameState2] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    if (!gameState2$) {
      return;
    }
    let cancled = false;
    const snapshot = async () => {
      const doc = await firstValueFrom(gameState2$);
      if (!cancled) {
        setGameState2(doc);
      }
    };
    snapshot();
    return () => {
      cancled = true;
    };
  }, [gameState2$]);

  const [roster1, roster2] =
    useRxData(
      async (db) => {
        // kick out if there's a problem getting the data
        if (!team1 || !team2) {
          // navigate("/game");
          return;
        }

        const _roster1 = await db.models
          .find()
          .where("id")
          .in(team1.roster.map((r) => r.name))
          .exec();

        const __roster1 = await Promise.all(_roster1.map((m) => m.expand()));
        reSort(
          __roster1,
          "id",
          team1.roster.map((r) => r.name)
        );

        const _roster2 = await db.models
          .find()
          .where("id")
          .in(team2.roster.map((r) => r.name))
          .exec();

        const __roster2 = await Promise.all(_roster2.map((m) => m.expand()));
        reSort(
          __roster2,
          "id",
          team2.roster.map((r) => r.name)
        );
        return [__roster1, __roster2];
      },
      [navigate, team1, team2]
    ) ?? [];

  if (!team1 || !team2) {
    return null;
  }
  if (!roster1 || !roster2) {
    return null;
  }

  return large ? (
    <>
      <GameList teams={[team1]} rosters={[roster1]} disabled={[false]} />
      <Divider orientation="vertical" />
      <GameList
        teams={[team2]}
        rosters={[roster2]}
        disabled={[networkActive]}
      />
    </>
  ) : (
    <GameList
      teams={[team1, team2]}
      rosters={[roster1, roster2]}
      disabled={[false, networkActive]}
    />
  );
}

const GameList = ({
  teams,
  rosters,
  disabled,
}: {
  teams: GBGameStateDoc[];
  rosters: GBModelExpanded[][];
  disabled: boolean[];
}) => {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const sizeRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const [cardWidth, setCardWidth] = useState(500);
  const [cardHeight, setCardHeight] = useState(700);
  const [slideHeight, setSlideHeight] = useState(700);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  const updateSize = useCallback(() => {
    const width = sizeRef.current?.getBoundingClientRect().width ?? 0;
    const height = sizeRef.current?.getBoundingClientRect().height ?? 0;
    const barHeight = large ? 56 : 112;
    setCardWidth(Math.min(width - 12, ((height - barHeight) * 5) / 7 - 12));
    setCardHeight(Math.min(height - barHeight - 12, (width * 7) / 5 - 12));
    setSlideHeight(height - barHeight);
  }, [large]);

  return (
    <div
      ref={sizeRef}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RosterList
        disabled={disabled}
        teams={teams}
        rosters={rosters}
        expanded={expanded}
        onClick={(i, expandList) => {
          setIndex(i);
          setExpanded(expandList);
          setOpen(!expandList);
        }}
      />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        <Modal
          disablePortal={true}
          sx={{
            /* same as app bar, bellow the drawer */
            zIndex: 1100,
          }}
          open={open}
          onClose={() => {
            setOpen(false);
            setExpanded(true);
          }}
          componentsProps={{
            root: {
              style: {
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
            backdrop: {
              style: {
                position: "absolute",
              },
            },
          }}
        >
          <Swiper
            initialSlide={index}
            direction="vertical"
            centeredSlides
            spaceBetween={(slideHeight - Math.min(cardHeight, 500)) / 2}
            onInit={(swiper) => {
              swiper.el.style.width = `${Math.min(cardWidth, 500)}px`;
              swiper.el.style.height = `${Math.min(cardHeight, 700)}px`;
              // swiper.el.style.height = `${slideHeight}px`;
            }}
            style={{
              overflow: "visible",
            }}
          >
            {teams
              .map((t, index) => [
                // Guild Rules Card
                () => <FlipGuildCard guild={t.guild} />,
                // Model Cards
                rosters[index].map((m, _index) => () => {
                  return (
                    <FlipCard
                      model={m}
                      health$={t.get$("roster").pipe(
                        map((r) => {
                          return r[_index].health;
                        })
                      )}
                    >
                      <CardControls
                        model={m}
                        state={teams[index]}
                        disabled={disabled[index]}
                      />
                    </FlipCard>
                  );
                }),
              ])
              .flat(2)
              .map((component, index) => (
                <SwiperSlide key={index}>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {component?.()}
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </Modal>
      </div>
    </div>
  );
};

function CardControls({
  state,
  model,
  disabled = false,
}: {
  state: GBGameStateDoc;
  model: GBModelExpanded;
  disabled: boolean;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        right: 0,
        bottom: 0,
        // bottom: `calc(22px * ${scale})`,
        // transform: `scale(${scale ?? 1})`,
        // transformOrigin: "bottom right",
      }}
    >
      <HealthCounter state={state} model={model} disabled={disabled} stacked />
    </Paper>
  );
}
