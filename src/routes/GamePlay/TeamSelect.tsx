import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  Fab,
  Typography,
  useTheme,
  Breadcrumbs,
  IconButton,
  // Snackbar,
  // Alert,
  Box,
  Divider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { GuildGrid, ControlProps } from "../../components/GuildGrid";
import GBIcon from "../../components/GBIcon";

import Color from "color";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import VersionTag from "../../components/VersionTag";
import { pulseAnimationKeyFrames } from "../../hooks/useUpdateAnimation";
import ResumeSnackBar from "./ResumeSnackBar";
import { useRxData, useRxQuery } from "../../hooks/useRxQuery";
import { useData } from "../../hooks/useData";

function SelectedIcon({ team, size }: { team: string; size: number }) {
  const guild = useRxData(
    (db) => db.guilds.findOne().where({ name: team }).exec(),
    [team]
  );

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

function GameControls(props: ControlProps) {
  const [selector, setSelector] = useState("P1");
  const [team1, setTeam1] = useState<string>();
  const [team2, setTeam2] = useState<string>();
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const { gbdb: db } = useData();

  const [teamDoc1, teamDoc2] =
    useRxData(async (db) => {
      const _team1 = await db.game_state
        .findOne()
        .where({ _id: "Player1" })
        .exec();
      const _team2 = await db.game_state
        .findOne()
        .where({ _id: "Player2" })
        .exec();
      return [_team1, _team2];
    }, []) ?? [];

  useEffect(() => {
    const sub1 = teamDoc1?.get$("guild").subscribe((g) => setTeam1(g));
    const sub2 = teamDoc2?.get$("guild").subscribe((g) => setTeam2(g));
    return () => {
      sub1?.unsubscribe();
      sub2?.unsubscribe();
    };
  }, [teamDoc1, teamDoc2]);

  const pickTeam = useCallback(
    async (name: string) => {
      console.log(`pickTeam: ${name}`);
      if (!name) {
        return;
      }
      if (selector === "P1") {
        await db?.game_state
          .upsert({ _id: "Player1", guild: name })
          .then((doc) => console.dir(doc))
          .catch(console.error);
        if (!team2) {
          setSelector("P2");
        } else {
          setSelector("GO");
        }
      } else if (selector === "P2") {
        await db?.game_state
          .upsert({ _id: "Player2", guild: name })
          .then((doc) => console.dir(doc))
          .catch(console.error);
        if (!team1) {
          setSelector("P1");
        } else {
          setSelector("GO");
        }
      }
    },
    [db, selector, team1, team2]
  );

  useEffect(() => {
    const sub = props.update$.subscribe((g) => pickTeam(g));
    return () => sub.unsubscribe();
  }, [props.update$, pickTeam]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: "5px",
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
        {team1 ? <SelectedIcon team={team1} size={props.size} /> : "P1"}
      </Button>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25em",
        }}
      >
        <Typography variant="caption">vs</Typography>
        <Fab
          ref={fabRef}
          color="secondary"
          disabled={!team1 || !team2}
          onClick={() => {
            navigate(`/game/draft/`);
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
      >
        {team2 ? <SelectedIcon team={team2} size={props.size} /> : "P2"}
      </Button>
    </div>
  );
}

export default function TeamSelect() {
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
      <GuildGrid Controller={GameControls} />
      <VersionTag />
      <ResumeSnackBar />
    </Box>
  );
}
