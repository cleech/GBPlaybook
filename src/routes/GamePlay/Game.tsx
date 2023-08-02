import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import {
  unstable_useBlocker,
  unstable_BlockerFunction,
} from "react-router-dom";
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
import { model } from "../../components/Draft";
import { useStore, IGBTeam } from "../../models/Root";
import RosterList, { HealthCounter } from "../../components/RosterList";
import { FlipCard } from "../../components/FlipCard";

import type { Swiper as SwiperRef } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/virtual";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import { useRTC } from "../../services/webrtc";
import { FlipGuildCard } from "../../components/GuildCard";

export default function Game() {
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
}

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
        right: 0,
        bottom: 0,
        // bottom: `calc(22px * ${scale})`,
        // transform: `scale(${scale ?? 1})`,
        // transformOrigin: "bottom right",
      }}
    >
      <HealthCounter model={model} disabled={disabled} stacked />
    </Paper>
  );
}
