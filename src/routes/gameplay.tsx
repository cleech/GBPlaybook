import * as React from "react";
import { useCallback, useState, useRef, useLayoutEffect } from "react";
import { Outlet, Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  Divider,
  Fab,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GuildGrid, ControlProps } from "../components/GuildGrid";
import GBIcon from "../components/GBIcon";
import { useData } from "../components/DataContext";
import {
  DraftList,
  roster,
  model,
  BlacksmithDraftList,
} from "../components/Draft";
import { useStore, IGBPlayer, IGBTeam } from "../models/Root";
import RosterList, { HealthCounter } from "../components/RosterList";
import { FlipCard, DoubleCard } from "../components/Card";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Virtual,
  // Navigation
} from "swiper";
import "swiper/css";
import "swiper/css/virtual";
// import "swiper/css/navigation";

function GameControls(
  props: ControlProps
): [JSX.Element, (name: string) => void] {
  const [selector, setSelector] = useState("P1");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  function pickTeam(name: string) {
    if (selector === "P1") {
      setTeam1(name);
      if (!team2) {
        setSelector("P2");
      } else {
        setSelector("GO");
      }
    } else if (selector === "P2") {
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
        justifyContent: "space-evenly",
        padding: "5px",
      }}
    >
      <Button
        variant="outlined"
        sx={{
          margin: "5px",
          minWidth: props.size,
          maxWidth: props.size,
          minHeight: props.size,
          maxHeight: props.size,
          fontSize: props.size * 0.5,
        }}
        onClick={() => setSelector("P1")}
      >
        {team1 ? <GBIcon icon={team1} fontSize={props.size} /> : "P1"}
      </Button>
      <Fab
        color="secondary"
        disabled={!team1 || !team2}
        component={Link}
        to={{ pathname: "/draft", search: `?p1=${team1}&p2=${team2}` }}
      >
        <PlayArrowIcon />
      </Fab>
      <Button
        variant="outlined"
        style={{
          margin: "5px",
          minWidth: props.size,
          maxWidth: props.size,
          minHeight: props.size,
          maxHeight: props.size,
          fontSize: props.size * 0.5,
        }}
        onClick={() => setSelector("P2")}
      >
        {team2 ? <GBIcon icon={team2} fontSize={props.size} /> : "P2"}
      </Button>
    </div>,
    pickTeam,
  ];
}

export default function GamePlay() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        // flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Outlet />
    </main>
  );
}

export const TeamSelect = () => <GuildGrid controls={GameControls} />;

export const Draft = () => {
  const store = useStore();
  const navigate = useNavigate();
  const [team1, setTeam1] = useState<roster | undefined>(undefined);
  const [team2, setTeam2] = useState<roster | undefined>(undefined);
  const ready1 = useCallback((team: roster) => setTeam1(team), []);
  const ready2 = useCallback((team: roster) => setTeam2(team), []);
  const unready1 = useCallback(() => setTeam1(undefined), []);
  const unready2 = useCallback(() => setTeam2(undefined), []);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  const g1 = searchParams.get("p1");
  const g2 = searchParams.get("p2");
  const guild1 = data.Guilds.find((g: any) => g.name === g1);
  const guild2 = data.Guilds.find((g: any) => g.name === g2);

  const DraftList1 =
    guild1.name === "Blacksmiths" ? BlacksmithDraftList : DraftList;
  const DraftList2 =
    guild2.name === "Blacksmiths" ? BlacksmithDraftList : DraftList;

  return (
    <>
      <DraftList1
        guild={guild1}
        ready={ready1}
        unready={unready1}
        ignoreRules={false}
      />
      <Fab
        disabled={!team1 || !team2}
        color="secondary"
        onClick={() => {
          store.team1.reset({ name: g1 ?? undefined, roster: team1 });
          store.team2.reset({ name: g2 ?? undefined, roster: team2 });
          navigate("/play");
        }}
      >
        <PlayArrowIcon />
      </Fab>
      <DraftList2
        guild={guild2}
        ready={ready2}
        unready={unready2}
        ignoreRules={false}
      />
    </>
  );
};

export const Game = () => {
  const store = useStore();
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const teams = [store.team1, store.team2];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {large ? (
        <>
          <GameList teams={[teams[0]]} />
          <Divider orientation="vertical" />
          <GameList teams={[teams[1]]} />
        </>
      ) : (
        <GameList teams={teams} />
      )}
    </div>
  );
};

export const GameList = ({ teams }: { teams: [...IGBTeam[]] }) => {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);

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
          setExpanded(expandList);
          setOpen(!expandList);
        }}
      />
      <div
        ref={ref}
        style={{
          position: "relative",
          overflow: "hidden",
          flexGrow: 1,
        }}
      />
      <Modal
        sx={{
          /* same as app bar, bellow the drawer */
          zIndex: 1100,
        }}
        open={open}
        container={ref.current}
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
          modules={[
            Virtual,
          ]}
          virtual
          initialSlide={index}
          direction="vertical"
          centeredSlides
          spaceBetween={(slideHeight - Math.min(cardHeight, 500))/2}
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
            .map((t) => t.roster)
            .flat()
            .map((m, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <FlipCard model={m} controls={CardControls} />
                </div>
                {/* <DoubleCard model={m} controls={CardControls} /> */}
              </SwiperSlide>
            ))}
        </Swiper>
      </Modal>
    </div>
  );
};

function CardControls({ model }: { model: model }) {
  return (
    <div
      style={{
        position: "absolute",
        right: "10px",
        bottom: "10px",
      }}
    >
      <HealthCounter model={model} />
    </div>
  );
}
