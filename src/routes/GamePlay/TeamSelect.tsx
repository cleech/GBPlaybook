import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  useTheme,
  Breadcrumbs,
  IconButton,
  Box,
} from "@mui/material";
import { GuildGrid, ControlProps } from "../../components/GuildGrid";
import GBIcon from "../../components/GBIcon";

import Color from "color";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import VersionTag from "../../components/VersionTag";
// import { pulseAnimationKeyFrames } from "../../hooks/useUpdateAnimation";
// import ResumeSnackBar from "./ResumeSnackBar";
import { useRxData } from "../../hooks/useRxQuery";

import { NetworkGame, useNetworkState } from "../../components/onlineSetup";
import { useGameState } from "../../hooks/useGameState";
import { GBGameStateDoc } from "../../models/gbdb";
import { NavigateFab } from "./NavigateFab";

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
  const theme = useTheme();

  const { active: networkActive } = useNetworkState();

  const { gameState1$, gameState2$ } = useGameState();

  const [teamDoc1, setGameState1] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    setTeam1(undefined);
    setSelector("P1");
    const sub = gameState1$?.subscribe((doc) => setGameState1(doc));
    return () => sub?.unsubscribe();
  }, [gameState1$]);

  const [teamDoc2, setGameState2] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    setTeam2(undefined);
    setSelector("P1");
    const sub = gameState2$?.subscribe((doc) => setGameState2(doc));
    return () => sub?.unsubscribe();
  }, [gameState2$]);

  useEffect(() => {
    const sub1 = teamDoc1?.get$("guild").subscribe((g) => setTeam1(g));
    return () => sub1?.unsubscribe();
  }, [teamDoc1]);

  useEffect(() => {
    const sub2 = teamDoc2?.get$("guild").subscribe((g) => setTeam2(g));
    return () => sub2?.unsubscribe();
  }, [teamDoc2]);

  const pickTeam = useCallback(
    async (name: string) => {
      if (!name) {
        return;
      }
      if (selector === "P1") {
        await teamDoc1
          ?.incrementalPatch({ guild: name, roster: [] })
          .catch(console.error);
        if (!team2 && !networkActive) {
          setSelector("P2");
        } else {
          setSelector("GO");
        }
      } else if (selector === "P2") {
        await teamDoc2
          ?.incrementalPatch({ guild: name, roster: [] })
          .catch(console.error);
        if (!team1) {
          setSelector("P1");
        } else {
          setSelector("GO");
        }
      }
    },
    [selector, team1, team2, teamDoc1, teamDoc2, networkActive]
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
        gap: "5px",
      }}
    >
      <Button
        variant="outlined"
        style={{
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
        <NavigateFab
          dest="Draft"
          disabled={!team1 || !team2}
          onAction={() => setWaiting(true)}
          sx={{ m: "0 15px" }}
        />
        <Typography variant="caption">
          {waiting ? "(waiting)" : "\u00A0"}
        </Typography>
      </div>
      <Button
        variant="outlined"
        disabled={networkActive}
        style={{
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <IconButton size="small" disabled>
              <Home sx={{ color: "text.secondary" }} />
            </IconButton>
          </Breadcrumbs>
          <NetworkGame />
        </div>
      </AppBarContent>
      <GuildGrid Controller={GameControls} />
      <VersionTag />
      {/* <ResumeSnackBar /> */}
    </Box>
  );
}
