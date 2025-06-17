import { useState, useEffect, MouseEvent, useCallback } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import {
  Typography,
  Breadcrumbs,
  IconButton,
  Box,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { Home, NavigateNext } from "@mui/icons-material";
import { css } from "@emotion/css";
import { firstValueFrom, Observable } from "rxjs";

import { AppBarContent } from "../App";
import VersionTag from "../../components/VersionTag";
import { GBDatabase, GBGameStateDoc } from "../../models/gbdbTypes";
import { Guild } from "../../components/DataTypes";
import { SettingsDoc } from "../../models/settings";
import { useRxData } from "../../hooks/useRxQuery";
import { NetworkGame } from "./components/NetworkGame";
import { useNetworkState } from "../../hooks/useNetworkState";
import { useGameState } from "../../hooks/useGameState";
import { Roster, DraftModel } from "./components/Draft";

import { NavigateFab } from "./components/NavigateFab";
import { DraftList, BSDraftList } from "./components/Draft";
import { reSort } from "../../utils/reSort";

const draftScreen = css({
  display: 'grid',
  overflow: 'visible',
  margin: 'auto',
  '@media(orientation: portrait)': {
    gridTemplateColumns: '1fr auto 1fr',
    justifyItems: 'center',
    '& > *': { gridColumn: 2 }
  },
  '@media(orientation: landscape)': {
    gridTemplateRows: '1fr auto 1fr',
    alignItems: 'center',
    '& > *': { gridRow: 2 }
  }
});

export default function Draft() {
  const { active: networkActive } = useNetworkState();
  return (
    <Box className={draftScreen}>
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
              href={`/game`}
              size="small"
              disabled={networkActive}
            >
              <Home />
            </IconButton>
            <Typography>Draft</Typography>
          </Breadcrumbs>
          <div>
            <GameSizeMenu />
            <NetworkGame />
          </div>
        </Box>
      </AppBarContent>
      <DraftInner />
      <VersionTag />
    </Box>
  );
}

function DraftInner() {
  const navigate = useNavigate();
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const { active: networkActive } = useNetworkState();
  const { gameState1$, gameState2$ } = useGameState();
  const [player1, setPlayer1] = useState<GBGameStateDoc | null>();

  useEffect(() => {
    if (!gameState1$) {
      return;
    }
    let canceled = false;
    const snapshot = async () => {
      const doc = await firstValueFrom(gameState1$);
      if (!canceled) {
        setPlayer1(doc);
      }
    };
    snapshot();
    return () => {
      canceled = true;
    };
  }, [gameState1$]);

  const [player2, setPlayer2] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    if (!gameState2$) {
      return;
    }
    let canceled = false;
    const snapshot = async () => {
      const doc = await firstValueFrom(gameState2$);
      if (!canceled) {
        setPlayer2(doc);
      }
    };
    snapshot();
    return () => {
      canceled = true;
    };
  }, [gameState2$]);

  const [guild1, guild2] =
    useRxData(
      async (db) => {
        const g1 = player1?.guild;
        const g2 = player2?.guild;
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
      [player1, player2, navigate]
    ) ?? [];

  const [roster1, roster2] = useRxData<[Roster | undefined, Roster | undefined]>(async (db) => {
    let roster1, roster2;
    if (guild1 && player1) {
      roster1 = await fetchRoster(db, guild1, player1);
    }
    if (guild2 && player2) {
      roster2 = await fetchRoster(db, guild2, player2);
    }
    return [roster1, roster2];
  }, [guild1, guild2, player1, player2]) ?? [];

  const navAction = useCallback(() => {
    if (!(guild1 && guild2 && player1 && player2)) return;
    const lineup = structuredClone(player1.getLatest().roster);
    reSort(lineup, "name", guild1.roster);
    player1
      .incrementalPatch({
        score: 0,
        momentum: 0,
        roster: lineup,
      })
      .catch(console.error);
    if (!networkActive) {
      const lineup = structuredClone(player2.getLatest().roster);
      reSort(lineup, "name", guild2.roster);
      player2
        .incrementalPatch({
          score: 0,
          momentum: 0,
          roster: lineup,
        })
        .catch(console.error);
    }
  }, [guild1, guild2, networkActive, player1, player2]);

  // wait for data load from db
  if (!guild1 || !guild2 || !player1 || !player2 || !roster1 || !roster2) {
    return null;
  }

  const DraftList1 = guild1.name === "Blacksmiths" ? BSDraftList : DraftList;
  const DraftList2 = guild2.name === "Blacksmiths" ? BSDraftList : DraftList;

  return (
    <>
      <DraftList1
        guild={guild1}
        stateDoc={player1}
        ready={() => setReady1(true)}
        unready={() => setReady1(false)}
        style={{ width: "100%" }}
        roster={roster1}
      />
      <NavigateFab
        dest="Game"
        disabled={!ready1 || !ready2}
        onAction={navAction}
        sx={{ m: "10px" }}
      />
      <DraftList2
        guild={guild2}
        stateDoc={player2}
        ready={() => setReady2(true)}
        unready={() => setReady2(false)}
        style={{ width: "100%" }}
        disabled={networkActive}
        roster={roster2}
      />
    </>
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
  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
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

async function fetchRoster(db: GBDatabase, guild: Guild, stateDoc: GBGameStateDoc) {
  const models = await db.models.find().where("id").in(guild.roster).exec();
  const tmpRoster: DraftModel[] = models.map((m) => Object.assign(m.toMutableJSON(), { disabled: 0, }));
  reSort(tmpRoster, "id", guild.roster);
  await stateDoc.incrementalModify((state) => {
    state.roster = [];
    return state;
  }).catch(console.error);
  return tmpRoster;
}
