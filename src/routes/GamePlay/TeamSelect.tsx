import React, { useState, useRef, useEffect } from "react";
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

import { useRTC } from "../../services/webrtc";
import VersionTag from "../../components/VersionTag";
import { pulseAnimationKeyFrames } from "../../hooks/useUpdateAnimation";
import ResumeSnackBar from "./ResumeSnackBar";
import { useRxData } from "../../hooks/useRxQuery";

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
    if (dc) {
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
      if (dc) {
        dc.onmessage = null;
      }
    };
  }, [dc, waiting, locked, navigate, team1, team2]);

  function pickTeam(name: string) {
    if (selector === "P1") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("p1", name);
      newParams.sort();
      setSearchParams(newParams, { replace: true });
      if (dc) {
        dc.send(JSON.stringify({ team: name }));
      }
      setTeam1(name);
      if (!team2 && !dc) {
        setSelector("P2");
      } else {
        setSelector("GO");
      }
    } else if (selector === "P2") {
      const newParams = new URLSearchParams(searchParams);
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

  return (
    <>
      <props.Inner size={props.size} pickTeam={pickTeam} />
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          // margin: "5px",
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
          {team2 ? <SelectedIcon team={team2} size={props.size} /> : "P2"}
        </Button>
      </div>
    </>
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
