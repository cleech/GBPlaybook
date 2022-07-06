import { useCallback, useState, useRef } from "react";
import { Outlet, Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Fab, Modal } from "@mui/material";
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
          fontSize: props.size * 0.5,
        }}
        onClick={() => setSelector("P1")}
      >
        {team1 ? <GBIcon icon={team1} fontSize={props.size} /> : "P1"}
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
  const teams = [store.team1, store.team2];

  // return <GameList teams={teams} />;
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <GameList teams={[teams[0]]} />;
      <GameList teams={[teams[1]]} />;
    </div>
  );
};

export const GameList = ({ teams }: { teams: [...IGBTeam[]] }) => {
  const store = useStore();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<IGBPlayer | undefined>(undefined);

  return (
    <div
      ref={ref}
      style={{
        overflow: "auto",
        position: "relative",
      }}
    >
      <RosterList
        // teams={[store.team1, store.team2]}
        teams={teams}
        onClick={(e, m) => {
          setModel(m);
          setOpen(true);
        }}
      />
      <Modal
        open={open}
        container={ref.current}
        onClose={() => setOpen(false)}
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
          direction="vertical"
          slidesPerView={1}
          centeredSlides
          autoHeight={true}
          spaceBetween={96}
          onInit={(swiper) => {
            swiper.el.style.width = "2.5in";
            swiper.el.style.height = "3.5in";
          }}
          style={{
            overflow: "visible",
          }}
        >
          {/* {[store.team1.roster, store.team2.roster].flat().map((m, index) => ( */}
          {teams
            .map((t) => t.roster)
            .flat()
            .map((m, index) => (
              <SwiperSlide
                key={index}
                // style={{
                // minWidth: "2.5in",
                // minHeight: "3.5in",
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
                // overflow: "visible",
                // }}
              >
                <FlipCard model={m} controls={CardControls} />
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
