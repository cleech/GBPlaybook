import React, {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import {
  Outlet,
  useLocation,
  useSearchParams,
  unstable_useBlocker,
  unstable_BlockerFunction,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  Divider,
  Fab,
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
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GuildGrid, ControlProps } from "../components/GuildGrid";
import GBIcon from "../components/GBIcon";
import { useData } from "../components/DataContext";
import { roster, model, DraftList, BSDraftList } from "../components/Draft";
import { useStore, IGBTeam } from "../models/Root";
import RosterList, { HealthCounter } from "../components/RosterList";
import { FlipCard } from "../components/Card";

import type { Swiper as SwiperRef } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper";
import "swiper/css";
import "swiper/css/virtual";

import Color from "color";

import "./Draft.css";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent, AppBarContext } from "../App";

import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";

import Lobby from "../components/Lobby";
import { useRTC } from "../services/webrtc";
import { observer } from "mobx-react-lite";
import { Offline, Online } from "react-detect-offline";
import { FlipGuildCard } from "../components/GuildCard";
import VersionTag from "../components/VersionTag";
import { pulseAnimationKeyFrames } from "../components/useUpdateAnimation";

function SelectedIcon({
  team,
  size,
  focused,
}: {
  team: string;
  size: number;
  focused: boolean;
}) {
  const { data } = useData();
  if (!data) {
    return null;
  }
  const guild = data.Guilds.find((g: any) => g.name === team);
  if (!guild) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        placeContent: "center",
        placeItems: "center",
        overflow: "hidden",
        zIndex: -1,
        backgroundColor: Color(guild.shadow ?? guild.darkColor ?? guild.color)
          .darken(0.25)
          .desaturate(0.25)
          .string(),
      }}
    >
      <GBIcon
        icon={team}
        fontSize={size}
        style={{
          // color: "rgba(0 0 0 60%)",
          // broken amazon web app tester
          color: "rgba(0, 0, 0, 60%)",
          flexShrink: 0,
        }}
      />
      <Typography
        variant="caption"
        style={
          {
            position: "absolute",
            color: "whitesmoke",
            textShadow:
              "1px 1px 1px black, -1px -1px 1px black, 1px -1px 1px black, -1px 1px 1px black, 0 1px 1px black, 1px 0 1px black, 0 -1px 1px black, -1px 0 1px black",
            // letterSpacing: "normal",
            textTransform: "capitalize",
          } as React.CSSProperties
        }
      >
        {team}
      </Typography>
    </div>
  );
}

function GameControls(
  props: ControlProps
): [JSX.Element, (name: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selector, setSelector] = useState("P1");
  const [team1, setTeam1] = useState(searchParams.get("p1") ?? "");
  const [team2, setTeam2] = useState(searchParams.get("p2") ?? "");
  const [waiting, setWaiting] = useState(false);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const { dc } = useRTC();

  useEffect(() => {
    if (!!dc) {
      dc.onmessage = (ev: MessageEvent<string>) => {
        const msg = JSON.parse(ev.data);
        if (msg.team) {
          setTeam2(msg.team);
        }
        if (msg.navigation === "ready") {
          setLocked(true);
          fabRef.current?.animate(pulseAnimationKeyFrames, 1000);
          if (waiting) {
            navigate(`/game/draft/?p1=${team1}&p2=${team2}`);
          }
        }
      };
    }
    return () => {
      if (!!dc) {
        dc.onmessage = null;
      }
    };
  }, [dc, waiting, locked, navigate, team1, team2]);

  function pickTeam(name: string) {
    if (selector === "P1") {
      let newParams = new URLSearchParams(searchParams);
      newParams.set("p1", name);
      newParams.sort();
      setSearchParams(newParams, { replace: true });
      if (!!dc) {
        dc.send(JSON.stringify({ team: name }));
      }
      setTeam1(name);
      if (!team2 && !dc) {
        setSelector("P2");
      } else {
        setSelector("GO");
      }
    } else if (selector === "P2") {
      let newParams = new URLSearchParams(searchParams);
      newParams.set("p2", name);
      newParams.sort();
      setSearchParams(newParams, { replace: true });
      setTeam2(name);
      if (!team1) {
        setSelector("P1");
      } else {
        setSelector("GO");
      }
    }
  }

  return [
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        variant="outlined"
        style={{
          margin: "5px",
          minWidth: props.size,
          maxWidth: props.size,
          minHeight: props.size,
          maxHeight: props.size,
          fontSize: props.size * 0.5,
          ...(selector === "P1"
            ? {
                borderColor: theme.palette.secondary.light,
                borderRadius: "12px",
                borderWidth: "4px",
              }
            : {
                borderColor: theme.palette.primary.dark,
                borderRadius: "12px",
                borderWidth: "4px",
              }),
        }}
        onClick={() => setSelector("P1")}
      >
        {team1 ? (
          <SelectedIcon
            team={team1}
            size={props.size}
            focused={selector === "P1"}
          />
        ) : (
          "P1"
        )}
      </Button>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25em",
          paddingBottom: "1.25em",
        }}
      >
        <Typography variant="caption">vs</Typography>
        <Fab
          ref={fabRef}
          color="secondary"
          disabled={!team1 || !team2}
          onClick={() => {
            if (dc) {
              setWaiting(true);
              dc.send(JSON.stringify({ navigation: "ready" }));
              if (locked) {
                navigate(`/game/draft/?p1=${team1}&p2=${team2}`);
              }
            } else {
              navigate(`/game/draft/?p1=${team1}&p2=${team2}`);
            }
          }}
          sx={{ m: "0 15px" }}
        >
          <PlayArrowIcon />
        </Fab>
        <Typography variant="caption">
          {waiting ? "(waiting)" : "\u00A0"}
        </Typography>
      </div>
      <Button
        variant="outlined"
        style={{
          margin: "5px",
          minWidth: props.size,
          maxWidth: props.size,
          minHeight: props.size,
          maxHeight: props.size,
          fontSize: props.size * 0.5,
          ...(selector === "P2"
            ? {
                borderColor: theme.palette.secondary.light,
                borderRadius: "12px",
                borderWidth: "4px",
              }
            : {
                borderColor: theme.palette.primary.dark,
                borderRadius: "12px",
                borderWidth: "4px",
              }),
        }}
        onClick={() => setSelector("P2")}
        disabled={!!dc}
      >
        {team2 ? (
          <SelectedIcon
            team={team2}
            size={props.size}
            focused={selector === "P2"}
          />
        ) : (
          "P2"
        )}
      </Button>
    </div>,
    pickTeam,
  ];
}

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

export const TeamSelect = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <IconButton size="small" disabled>
            <Home sx={{ color: "text.secondary" }} />
          </IconButton>
        </Breadcrumbs>
      </AppBarContent>
      <ResumeSnackBar />
      <GuildGrid controls={GameControls} />
      <VersionTag />
    </Box>
  );
};

export const Draft = () => {
  const store = useStore();
  const [waiting, setWaiting] = useState(false);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  const { dc } = useRTC();

  const [team1, setTeam1] = useState<roster | undefined>(undefined);
  const [team2, setTeam2] = useState<roster | undefined>(undefined);
  const ready1 = useCallback((team: roster) => setTeam1(team), []);
  const ready2 = useCallback((team: roster) => setTeam2(team), []);
  const unready1 = useCallback(() => setTeam1(undefined), []);
  const unready2 = useCallback(() => setTeam2(undefined), []);

  const player2 = useRef<any>();
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const [searchParams] = useSearchParams();
  const g1 = searchParams.get("p1");
  const g2 = searchParams.get("p2");

  useEffect(() => {
    if (!!dc) {
      dc.onmessage = (ev: MessageEvent<string>) => {
        const msg = JSON.parse(ev.data);
        if (msg.m) {
          player2.current?.setModel(msg.m.id, msg.selected);
        }
        if (msg.navigation === "ready") {
          setLocked(true);
          fabRef.current?.animate(pulseAnimationKeyFrames, 1000);
          if (waiting) {
            store.team1.reset({ name: g1 ?? undefined, roster: team1 });
            store.team2.reset({ name: g2 ?? undefined, roster: team2 });
            navigate("/game/draft/play");
          }
        }
      };
    }
    return () => {
      if (!!dc) {
        dc.onmessage = null;
      }
    };
  }, [
    dc,
    waiting,
    locked,
    g1,
    g2,
    navigate,
    team1,
    team2,
    store.team1,
    store.team2,
  ]);

  const { data } = useData();
  if (!data) {
    return null;
  }
  const guild1 = data.Guilds.find((g: any) => g.name === g1);
  const guild2 = data.Guilds.find((g: any) => g.name === g2);
  /* FIXME, error message and kick back a screen ? */
  if (!guild1 || !guild2) {
    return null;
  }

  const DraftList1 = guild1.name === "Blacksmiths" ? BSDraftList : DraftList;
  const DraftList2 = guild2.name === "Blacksmiths" ? BSDraftList : DraftList;

  return (
    <Box className="DraftScreen">
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link
            color="inherit"
            href={`/game?p1=${g1}&p2=${g2}`}
            component={IconButton}
            size="small"
          >
            <Home />
          </Link>
          <Typography>Draft</Typography>
        </Breadcrumbs>
      </AppBarContent>

      <DraftList1
        guild={guild1}
        ready={ready1}
        unready={unready1}
        ignoreRules={false}
        style={{ width: "100%" }}
        // network play additions
        onUpdate={
          dc
            ? (m, v) => {
                dc.send(JSON.stringify({ m: m, selected: v }));
              }
            : undefined
        }
      />

      <Typography variant="caption">{"\u00A0"}</Typography>
      <Fab
        ref={fabRef}
        color="secondary"
        disabled={!team1 || !team2}
        onClick={() => {
          if (dc) {
            setWaiting(true);
            dc.send(JSON.stringify({ navigation: "ready" }));
            if (locked) {
              store.team1.reset({ name: g1 ?? undefined, roster: team1 });
              store.team2.reset({ name: g2 ?? undefined, roster: team2 });
              navigate("/game/draft/play");
            }
          } else {
            store.team1.reset({ name: g1 ?? undefined, roster: team1 });
            store.team2.reset({ name: g2 ?? undefined, roster: team2 });
            navigate("/game/draft/play");
          }
        }}
        sx={{ m: "10px" }}
      >
        <PlayArrowIcon />
      </Fab>
      <Typography variant="caption">
        {waiting ? "(waiting)" : "\u00A0"}
      </Typography>

      <DraftList2
        guild={guild2}
        ready={ready2}
        unready={unready2}
        ignoreRules={false}
        style={{ width: "100%" }}
        // network play additions
        disabled={!!dc}
        ref={player2}
      />

      <ResumeSnackBar />
      <VersionTag />
    </Box>
  );
};

export const Game = () => {
  const store = useStore();
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const teams = useMemo(
    () => [store.team1, store.team2],
    [store.team1, store.team2]
  );
  const [showSnack, setShowSnack] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const { dc } = useRTC();
  if (dc) {
    teams[1].disable(true);
  }

  useEffect(() => {
    if (!!dc) {
      dc.onmessage = (ev: MessageEvent<string>) => {
        const msg = JSON.parse(ev.data);
        if (msg.model && msg.health !== undefined) {
          const m = teams[1].roster.find((m) => m.id === msg.model);
          m?.setHealth(msg.health);
        }
        if (msg.VP !== undefined) {
          teams[1].setScore(msg.VP);
        }
        if (msg.MOM !== undefined) {
          teams[1].setMomentum(msg.MOM);
        }
      };
    }
    return () => {
      if (!!dc) {
        dc.onmessage = null;
      }
    };
  }, [dc, teams]);

  let blocker = unstable_useBlocker(
    React.useCallback<unstable_BlockerFunction>(
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
  React.useEffect(() => {
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
          <Link
            color="inherit"
            href={`/game?p1=${teams[0].name}&p2=${teams[1].name}`}
            component={IconButton}
            size="small"
          >
            <Home />
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href={`/game/draft?p1=${teams[0].name}&p2=${teams[1].name}`}
          >
            Draft
          </Link>
          <Typography>Play</Typography>
        </Breadcrumbs>
      </AppBarContent>

      {large ? (
        <>
          <GameList teams={[teams[0]]} />
          <Divider orientation="vertical" />
          <GameList teams={[teams[1]]} />
        </>
      ) : (
        <GameList teams={teams} />
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
};

export const GameList = ({ teams }: { teams: [...IGBTeam[]] }) => {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const sizeRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);

  const [cardWidth, setCardWidth] = useState(240);
  const [cardHeight, setCardHeight] = useState(336);
  const [slideHeight, setSlideHeight] = useState(336);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  function updateSize() {
    let width = sizeRef.current?.getBoundingClientRect().width ?? 0;
    let height = sizeRef.current?.getBoundingClientRect().height ?? 0;
    let barHeight = large ? 56 : 112;
    setCardWidth(Math.min(width - 12, ((height - barHeight) * 5) / 7 - 12));
    setCardHeight(Math.min(height - barHeight - 12, (width * 7) / 5 - 12));
    setSlideHeight(height - barHeight);
  }
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
        expanded={expanded}
        onClick={(i, expandList) => {
          setIndex(i);
          // swiper?.slideTo(index, 0, false);
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
            onSwiper={setSwiper}
            modules={[Virtual]}
            virtual
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
              .map((t) => [
                // Guild Rules Card
                () => <FlipGuildCard guild={t.name} />,
                // Model Cards
                t.roster.map((m) => () => (
                  <FlipCard
                    model={m}
                    controls={CardControls}
                    controlProps={{ disabled: t.disabled }}
                  />
                )),
              ])
              .flat(2)
              .map((component, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
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
  model,
  disabled = false,
}: {
  model: model;
  disabled?: boolean;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        // right: "0.125in",
        // bottom: "0.125in",
        // padding: "0.0625in",
        right: "0",
        bottom: "0",
        // transform: `scale(${scale ?? 1})`,
        // transformOrigin: "bottom right",
      }}
    >
      <HealthCounter model={model} disabled={disabled} />
    </Paper>
  );
}
