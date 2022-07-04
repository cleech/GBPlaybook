import { useCallback, useState, useRef, SetStateAction } from "react";
import { Outlet, Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Fab, Popover } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GuildGrid, ControlProps } from "../components/GuildGrid";
import { useData } from "../components/DataContext";
import {
  DraftList,
  roster,
  model,
  BlacksmithDraftList,
} from "../components/Draft";
import { useStore, IGBPlayer, IGBTeam } from "../models/Root";
import RosterList, { HealthCounter } from "../components/RosterList";
import { FlipCard } from "../components/Card";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";

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
        }}
        onClick={() => setSelector("P1")}
      >
        {team1 || "P1"}
      </Button>
      <Fab
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
        }}
        onClick={() => setSelector("P2")}
      >
        {team2 || "P2"}
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
      <DraftList1 guild={guild1} ready={ready1} unready={unready1} />
      <Fab
        disabled={!team1 || !team2}
        onClick={() => {
          store.team1.reset({ name: g1 ?? undefined, roster: team1 });
          store.team2.reset({ name: g2 ?? undefined, roster: team2 });
          navigate("/play");
        }}
      >
        <PlayArrowIcon />
      </Fab>
      <DraftList2 guild={guild2} ready={ready2} unready={unready2} />
    </>
  );
};

export const Game = () => {
  const store = useStore();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<IGBPlayer | undefined>(undefined);

  return (
    <div ref={ref} style={{ overflow: "auto" }}>
      <RosterList
        teams={[store.team1, store.team2]}
        onClick={(e, m) => {
          setModel(m);
          setOpen(true);
        }}
      />
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorReference="anchorEl"
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        style={
          {
            // display: "flex",
            // height: "100%",
            // width: "100%",
            // flexDirection: "column",
          }
        }
      >
        <Swiper
          direction="vertical"
          slidesPerView={1}
          centeredSlides
          autoHeight={true}
          onInit={(swiper) => {
            swiper.el.style.width = "100%";
            swiper.el.style.height = "6in";
          }}
        >
          {[store.team1.roster, store.team2.roster].flat().map((m, index) => (
            <SwiperSlide
              key={index}
              style={{
                minWidth: "3in",
                minHeight: "4in",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <FlipCard model={m} controls={CardControls} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Popover>
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
