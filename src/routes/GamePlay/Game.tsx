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

// import { useRTC } from "../../services/webrtc";
import { FlipGuildCard } from "../../components/GuildCard";
import { useData } from "../../components/DataContext";
import { GBGameStateDoc, GBModelExpanded } from "../../models/gbdb";
import { reSort } from "../../components/reSort";
import { map } from "rxjs";

export default function Game() {
  const { gbdb: db } = useData();
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  const [team1, setTeam1] = useState<GBGameStateDoc>();
  const [team2, setTeam2] = useState<GBGameStateDoc>();

  const [roster1, setRoster1] = useState<GBModelExpanded[]>();
  const [roster2, setRoster2] = useState<GBModelExpanded[]>();

  const navigate = useNavigate();

  useEffect(() => {
    let cancled = false;
    // wait for db init
    if (!db) {
      return;
    }
    const fetchData = async () => {
      const _team1 = await db.game_state
        .findOne()
        .where({ _id: "Player1" })
        .exec();
      const _team2 = await db.game_state
        .findOne()
        .where({ _id: "Player2" })
        .exec();

      // kick out if there's a problem getting the data
      if (!_team1 || !_team2) {
        navigate("/game");
        return;
      }

      const _roster1 = await db.models
        .find()
        .where("id")
        .in(_team1.roster.map((r) => r.name))
        .exec();

      const roster1 = await Promise.all(_roster1.map((m) => m.expand()));
      reSort(
        roster1,
        "id",
        _team1.roster.map((r) => r.name)
      );

      const _roster2 = await db.models
        .find()
        .where("id")
        .in(_team2.roster.map((r) => r.name))
        .exec();

      const roster2 = await Promise.all(_roster2.map((m) => m.expand()));
      reSort(
        roster2,
        "id",
        _team2.roster.map((r) => r.name)
      );

      if (!cancled) {
        setTeam1(_team1);
        setTeam2(_team2);
        setRoster1(roster1);
        setRoster2(roster2);
      }
    };
    fetchData().catch(console.error);
    return () => {
      cancled = true;
    };
  }, [db, navigate]);

  const [showSnack, setShowSnack] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // const { dc } = useRTC();
  // if (dc) {
  //   teams[1].disable(true);
  // }

  // useEffect(() => {
  //   if (!!dc) {
  //     dc.onmessage = (ev: MessageEvent<string>) => {
  //       const msg = JSON.parse(ev.data);
  //       if (msg.model && msg.health !== undefined) {
  //         const m = teams[1].roster.find((m) => m.id === msg.model);
  //         m?.setHealth(msg.health);
  //       }
  //       if (msg.VP !== undefined) {
  //         teams[1].setScore(msg.VP);
  //       }
  //       if (msg.MOM !== undefined) {
  //         teams[1].setMomentum(msg.MOM);
  //       }
  //     };
  //   }
  //   return () => {
  //     if (!!dc) {
  //       dc.onmessage = null;
  //     }
  //   };
  // }, [dc, teams]);

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

  if (!team1 || !team2) {
    return null;
  }
  if (!roster1 || !roster2) {
    return null;
  }

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
          <IconButton
            color="inherit"
            href={`/game?p1=${team1.guild}&p2=${team2.guild}`}
            size="small"
          >
            <Home />
          </IconButton>
          <Link
            underline="hover"
            color="inherit"
            href={`/game/draft?p1=${team1.guild}&p2=${team2.guild}`}
          >
            Draft
          </Link>
          <Typography>Play</Typography>
        </Breadcrumbs>
      </AppBarContent>

      {large ? (
        <>
          <GameList teams={[team1]} rosters={[roster1]} />
          <Divider orientation="vertical" />
          <GameList teams={[team2]} rosters={[roster2]} />
        </>
      ) : (
        <GameList teams={[team1, team2]} rosters={[roster1, roster2]} />
      )}

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

export const GameList = ({
  teams,
  rosters,
}: {
  teams: GBGameStateDoc[];
  rosters: GBModelExpanded[][];
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
                      controls={CardControls}
                      controlProps={{
                        state: teams[index],
                        disabled: t.disabled,
                      }}
                    />
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
  disabled?: boolean;
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
