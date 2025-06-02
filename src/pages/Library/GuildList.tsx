import {
  useEffect,
  RefObject,
} from "react";

import {
  useNavigate,
  useOutletContext,
  useLoaderData,
} from "react-router-dom";

import {
  Typography,
  Breadcrumbs,
} from "@mui/material";

import {
  ControlProps,
  GridIconButton,
  GuildGrid,
} from "../../components/GuildGrid";

import { AppBarContent } from "../App";
import { NavigateNext, } from "@mui/icons-material";
import VersionTag from "../../components/VersionTag";
import { GBGuildDoc } from "../../models/gbdbTypes";

export default function GuildList() {
  const slideRef = useOutletContext<{ slideRef: RefObject<number>; }>().slideRef;
  const guilds = useLoaderData<GBGuildDoc[]>();
  slideRef.current = 0;

  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Typography>Library</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <GuildGrid guilds={guilds} Controller={ExtraIconsControl} />
      <VersionTag />
    </>
  );
}

function ExtraIconsControl(props: ControlProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const sub = props.update$.subscribe((g) => navigate(g));
    return () => sub.unsubscribe();
  }, [navigate, props.update$]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        margin: "5px",
      }}
    >
      <GridIconButton
        g={{
          key: "gameplans",
          name: "gameplans",
          icon: "GB",
          style: { color: "#f8f7f4" },
        }}
        pickTeam={() => navigate("gameplans")}
        size={props.size}
      />
      <GridIconButton
        g={{
          key: "refcards",
          name: "Rules",
          icon: "GB",
          style: { color: "#f8f7f4" },
        }}
        pickTeam={() => navigate("refcards")}
        size={props.size}
      />
    </div>
  );
}