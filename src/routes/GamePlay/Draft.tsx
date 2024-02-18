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
  Menu,
  MenuItem,
  MenuList,
  Avatar,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import { useData } from "../../components/DataContext";
import { DraftList, BSDraftList } from "../../components/Draft";
import { useStore } from "../../models/Root";

import "./Draft.css";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import { useRTC } from "../../services/webrtc";
import VersionTag from "../../components/VersionTag";
import { pulseAnimationKeyFrames } from "../../components/useUpdateAnimation";
import { GBGuild, GBModel } from "../../models/gbdb";
import { retry } from "rxjs";
import { GBModelType } from "../../models/rxdb";

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

  const [team1, setTeam1] = useState<GBModelType[] | undefined>(undefined);
  const [team2, setTeam2] = useState<GBModelType[] | undefined>(undefined);
  const ready1 = useCallback((team: GBModelType[]) => setTeam1(team), []);
  const ready2 = useCallback((team: GBModelType[]) => setTeam2(team), []);
  const unready1 = useCallback(() => setTeam1(undefined), []);
  const unready2 = useCallback(() => setTeam2(undefined), []);

  const player2 = useRef<any>();
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const [searchParams] = useSearchParams();
  const g1 = searchParams.get("p1");
  const g2 = searchParams.get("p2");

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(menuAnchor);
  const settingsClick = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const settingsClose = () => {
    setMenuAnchor(null);
  };

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

  const { gbdb: db } = useData();

  const [guild1, setGuild1] = useState<GBGuild | null>(null);
  const [guild2, setGuild2] = useState<GBGuild | null>(null);

  useEffect(() => {
    if (!db || !g1 || !g2) {
      return;
    }
    const fetchData = async () => {
      const [guild1, guild2] = await Promise.all([
        db.guilds.findOne().where({ name: g1 }).exec(),
        db.guilds.findOne().where({ name: g2 }).exec(),
      ]);
      setGuild1(guild1);
      setGuild2(guild2);
    };
    fetchData();
  }, [db, g1, g2]);

  if (!guild1 || !guild2) {
    return null;
  }

  const DraftList1 = guild1.name === "Blacksmiths" ? BSDraftList : DraftList;
  const DraftList2 = guild2.name === "Blacksmiths" ? BSDraftList : DraftList;

  return (
    <Box className="DraftScreen">
      <AppBarContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
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

          <IconButton
            onClick={settingsClick}
            color="inherit"
            size="small"
            // variant="contained"
            sx={{
              backgroundColor: "primary.dark",
            }}
          >
            <Typography>
              {store.settings.gameSize}v{store.settings.gameSize}
            </Typography>
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={settingsOpen}
            onClose={settingsClose}
            onClick={settingsClose}
          >
            <MenuList dense>
              <MenuItem
                selected={store.settings.gameSize === 6}
                onClick={() => {
                  store.settings.setGameSize(6);
                }}
              >
                6v6
              </MenuItem>
              <MenuItem
                selected={store.settings.gameSize === 4}
                onClick={() => {
                  store.settings.setGameSize(4);
                }}
              >
                4v4
              </MenuItem>
              <MenuItem
                selected={store.settings.gameSize === 3}
                onClick={() => {
                  store.settings.setGameSize(3);
                }}
              >
                3v3
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </AppBarContent>

      <DraftList1
        // hacky, but force reset when this setting changes
        key={`1-${store.settings.gameSize}`}
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
        // hacky, but force reset when this setting changes
        key={`2-${store.settings.gameSize}`}
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
