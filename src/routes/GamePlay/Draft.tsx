import React, { useCallback, useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  Fab,
  Typography,
  Link,
  Breadcrumbs,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useData } from "../../components/DataContext";
import { roster, DraftList, BSDraftList } from "../../components/Draft";
import { useStore } from "../../models/Root";

import "./Draft.css";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import { useRTC } from "../../services/webrtc";
import VersionTag from "../../components/VersionTag";
import { pulseAnimationKeyFrames } from "../../components/useUpdateAnimation";

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

export default function Draft() {
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
          <IconButton
            color="inherit"
            href={`/game?p1=${g1}&p2=${g2}`}
            size="small"
          >
            <Home />
          </IconButton>
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
}
