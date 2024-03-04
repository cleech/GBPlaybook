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
import { useData } from "../../hooks/useData";
import { DraftList, BSDraftList } from "../../components/Draft";

import "./Draft.css";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../../App";

import VersionTag from "../../components/VersionTag";
// import { pulseAnimationKeyFrames } from "../../components/useUpdateAnimation";
import { GBModel } from "../../models/gbdb";
import ResumeSnackBar from "./ResumeSnackBar";
import { SettingsDoc } from "../../models/settings";
import { useSettings } from "../../hooks/useSettings";
import { useRxData } from "../../hooks/useRxQuery";
import { map } from "rxjs";

export default function Draft() {
  const { setting$ } = useSettings();
  const navigate = useNavigate();
  // const [waiting, setWaiting] = useState(false);
  // const [locked, setLocked] = useState(false);
  // const { dc } = useRTC();

  const [team1, setTeam1] = useState<GBModel[] | undefined>();
  const [team2, setTeam2] = useState<GBModel[] | undefined>();
  const ready1 = useCallback((team: GBModel[]) => setTeam1(team), []);
  const ready2 = useCallback((team: GBModel[]) => setTeam2(team), []);
  const unready1 = useCallback(() => setTeam1(undefined), []);
  const unready2 = useCallback(() => setTeam2(undefined), []);

  const fabRef = useRef<HTMLButtonElement | null>(null);

  const [gameSize, setGameSize] = useState<3 | 4 | 6>();
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.gameSize))
      .subscribe((gs) => setGameSize(gs));
    return () => sub?.unsubscribe();
  }, [setting$]);

  const player1 = useRxData((db) =>
    db.game_state.findOne().where({ _id: "Player1" }).exec()
  );
  const player2 = useRxData((db) =>
    db.game_state.findOne().where({ _id: "Player2" }).exec()
  );
  const g1 = player1?.guild;
  const g2 = player2?.guild;

  const { gbdb: db } = useData();

  const [guild1, guild2] =
    useRxData(
      async (db) => {
        // kick out if we didn't get guild names in URL
        if (!g1 || !g2) {
          //   navigate("/game");
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
  if (!guild1 || !guild2 || !player1 || !player2) {
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

          <GameSizeMenu />
        </Box>
      </AppBarContent>

      <DraftList1
        // hacky, but force reset when this setting changes
        key={`1-${gameSize}`}
        guild={guild1}
        stateDoc={player1}
        ready={ready1}
        unready={unready1}
        style={{ width: "100%" }}
      />

      {/* <Typography variant="caption">{"\u00A0"}</Typography> */}
      <Fab
        ref={fabRef}
        color="secondary"
        disabled={!team1 || !team2}
        onClick={async () => {
          await db?.game_state
            .upsert({
              _id: "Player1",
              guild: guild1.name,
              roster: team1?.map((m) => ({ name: m.id, health: m.hp })) || [],
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
              score: 0,
              momentum: 0,
              disabled: false,
            })
            .catch(console.error);
          navigate("/game/draft/play");
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
        key={`2-${gameSize}`}
        guild={guild2}
        stateDoc={player2}
        ready={ready2}
        unready={unready2}
        style={{ width: "100%" }}
      />

      <VersionTag />
      <ResumeSnackBar />
    </Box>
  );
}

function GameSizeMenu() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(menuAnchor);
  const settingsClick = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const settingsClose = () => {
    setMenuAnchor(null);
  };
  const { setting$ } = useSettings();
  const [settings, setSettings] = useState<SettingsDoc | null>();
  useEffect(() => {
    const sub = setting$?.subscribe((s) => setSettings(s));
    return () => sub?.unsubscribe();
  }, [setting$]);

  const gameSize = settings?.toJSON().data.gameSize;

  return (
    <>
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
          {gameSize}v{gameSize}
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
            selected={gameSize === 6}
            onClick={() => {
              settings?.incrementalPatch({ gameSize: 6 });
            }}
          >
            6v6
          </MenuItem>
          <MenuItem
            selected={gameSize === 4}
            onClick={() => {
              settings?.incrementalPatch({ gameSize: 4 });
            }}
          >
            4v4
          </MenuItem>
          <MenuItem
            selected={gameSize === 3}
            onClick={() => {
              settings?.incrementalPatch({ gameSize: 3 });
            }}
          >
            3v3
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
