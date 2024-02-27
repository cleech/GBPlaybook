import { useCallback, useState, useRef, useEffect, MouseEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Fab,
  Typography,
  Breadcrumbs,
  IconButton,
  Box,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useData } from "../../components/DataContext";
import { DraftList, BSDraftList } from "../../components/Draft";

import "./Draft.css";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

// import { useRTC } from "../../services/webrtc";
import VersionTag from "../../components/VersionTag";
// import { pulseAnimationKeyFrames } from "../../components/useUpdateAnimation";
import { GBGuildDoc, GBModel } from "../../models/gbdb";
import ResumeSnackBar from "./ResumeSnackBar";
import { useSettings } from "../../models/settings";
import { useRxData } from "../../components/useRxQuery";

export default function Draft() {
  const { settings, settingsDoc } = useSettings();
  // const [waiting, setWaiting] = useState(false);
  // const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  // const { dc } = useRTC();

  const [team1, setTeam1] = useState<GBModel[] | undefined>();
  const [team2, setTeam2] = useState<GBModel[] | undefined>();
  const ready1 = useCallback((team: GBModel[]) => setTeam1(team), []);
  const ready2 = useCallback((team: GBModel[]) => setTeam2(team), []);
  const unready1 = useCallback(() => setTeam1(undefined), []);
  const unready2 = useCallback(() => setTeam2(undefined), []);

  const player2 = useRef<unknown>();
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const [searchParams] = useSearchParams();
  const g1 = searchParams.get("p1");
  const g2 = searchParams.get("p2");

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(menuAnchor);
  const settingsClick = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const settingsClose = () => {
    setMenuAnchor(null);
  };

  // useEffect(() => {
  //   if (!!dc) {
  //     dc.onmessage = (ev: MessageEvent<string>) => {
  //       const msg = JSON.parse(ev.data);
  //       if (msg.m) {
  //         player2.current?.setModel(msg.m.id, msg.selected);
  //       }
  //       if (msg.navigation === "ready") {
  //         setLocked(true);
  //         fabRef.current?.animate(pulseAnimationKeyFrames, 1000);
  //         if (waiting) {
  //           store.team1.reset({ name: g1 ?? undefined, roster: team1 });
  //           store.team2.reset({ name: g2 ?? undefined, roster: team2 });
  //           navigate("/game/draft/play");
  //         }
  //       }
  //     };
  //   }
  //   return () => {
  //     if (!!dc) {
  //       dc.onmessage = null;
  //     }
  //   };
  // }, [
  //   dc,
  //   waiting,
  //   locked,
  //   g1,
  //   g2,
  //   navigate,
  //   team1,
  //   team2,
  //   store.team1,
  //   store.team2,
  // ]);

  const { gbdb: db } = useData();

  const [guild1, guild2] =
    useRxData(
      async (db) => {
        // kick out if we didn't get guild names in URL
        if (!g1 || !g2) {
          navigate("/game");
          return;
        }
        const [_guild1, _guild2] = await Promise.all([
          db.guilds.findOne().where({ name: g1 }).exec(),
          db.guilds.findOne().where({ name: g2 }).exec(),
        ]);
        // kick out if we can't find the guild names passed in the URL
        if (!_guild1 || !_guild2) {
          navigate("/game");
          return;
        }
        return [_guild1, _guild2];
      },
      [g1, g2, navigate]
    ) ?? [];

  // wait for data load from db
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
              {settings.gameSize}v{settings.gameSize}
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
                selected={settings.gameSize === 6}
                onClick={() => {
                  settingsDoc?.set("gameSize", 6);
                }}
              >
                6v6
              </MenuItem>
              <MenuItem
                selected={settings.gameSize === 4}
                onClick={() => {
                  settingsDoc?.set("gameSize", 4);
                }}
              >
                4v4
              </MenuItem>
              <MenuItem
                selected={settings.gameSize === 3}
                onClick={() => {
                  settingsDoc?.set("gameSize", 3);
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
        key={`1-${settings.gameSize}`}
        guild={guild1}
        ready={ready1}
        unready={unready1}
        ignoreRules={false}
        style={{ width: "100%" }}
        // network play additions
        // onUpdate={
        //   dc
        //     ? (m, v) => {
        //         dc.send(JSON.stringify({ m: m, selected: v }));
        //       }
        //     : undefined
        // }
      />

      {/* <Typography variant="caption">{"\u00A0"}</Typography> */}
      <Fab
        ref={fabRef}
        color="secondary"
        disabled={!team1 || !team2}
        onClick={async () => {
          // if (dc) {
          // setWaiting(true);
          // dc.send(JSON.stringify({ navigation: "ready" }));
          // if (locked) {
          //   store.team1.reset({ name: g1 ?? undefined, roster: team1 });
          //   store.team2.reset({ name: g2 ?? undefined, roster: team2 });
          //   navigate("/game/draft/play");
          // }
          // } else {
          await db?.game_state
            .upsert({
              _id: "Player1",
              guild: guild1.name,
              roster: team1?.map((m) => ({ name: m.id, health: m.hp })) || [],
              // why don't defaults work?
              score: 0,
              momentum: 0,
              disabled: false,
            })
            .catch(console.error);
          await db?.game_state
            .upsert({
              _id: "Player2",
              guild: guild2.name,
              roster: team2?.map((m) => ({ name: m.id, health: m.hp })) || [],
              // why don't defaults work?
              score: 0,
              momentum: 0,
              disabled: false,
            })
            .catch(console.error);
          navigate("/game/draft/play");
          // }
        }}
        sx={{ m: "10px" }}
      >
        <PlayArrowIcon />
      </Fab>
      {/* <Typography variant="caption">
        {waiting ? "(waiting)" : "\u00A0"}
      </Typography> */}

      <DraftList2
        // hacky, but force reset when this setting changes
        key={`2-${settings.gameSize}`}
        guild={guild2}
        ready={ready2}
        unready={unready2}
        ignoreRules={false}
        style={{ width: "100%" }}
        // network play additions
        // disabled={!!dc}
        ref={player2}
      />

      <VersionTag />
      <ResumeSnackBar />
    </Box>
  );
}
