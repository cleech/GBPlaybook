import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  useTheme,
  Breadcrumbs,
  IconButton,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { GuildGrid, ControlProps } from "../../components/GuildGrid";
import GBIcon from "../../components/GBIcon";
import { useGBData } from "../../hooks/useGBData";
import { useData } from "../../hooks/useData"; // Added
import { GBSavedListDoc, GBDatabase, GBModelDoc } from "../../models/gbdbTypes"; // Added GBModelDoc

import Color from "color";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../App";

import VersionTag from "../../components/VersionTag";
// import { pulseAnimationKeyFrames } from "../../hooks/useUpdateAnimation";
import { useRxData } from "../../hooks/useRxQuery";

import { NetworkGame } from "./components/NetworkGame";
import { useNetworkState } from "../../hooks/useNetworkState";
import { useGameState } from "../../hooks/useGameState";
import { GBGameStateDoc, GBGuildDoc } from "../../models/gbdbTypes";
import { NavigateFab } from "./components/NavigateFab";
import { useLoaderData } from "react-router-dom";

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

  const [player1Mode, setPlayer1Mode] = useState<"guild" | "list">("guild");
  const [player2Mode, setPlayer2Mode] = useState<"guild" | "list">("guild");
  const [fetchedSavedLists, setFetchedSavedLists] = useState<GBSavedListDoc[]>([]);
  const [player1ListName, setPlayer1ListName] = useState<string | undefined>(undefined);
  const [player2ListName, setPlayer2ListName] = useState<string | undefined>(undefined);

  const { active: networkActive } = useNetworkState();

  const { gameState1$, gameState2$ } = useGameState();
  const { gbdb } = useData(); // Get gbdb instance

  const savedListsData = useGBData<GBSavedListDoc[]>(
    async (db: GBDatabase) => db.saved_lists.find().exec(),
    []
  );

  useEffect(() => {
    if (savedListsData) {
      setFetchedSavedLists(savedListsData);
    }
  }, [savedListsData]);


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
    // Only subscribe to pickTeam if the current player is in guild mode
    const sub = props.update$.subscribe((g) => {
      if (selector === "P1" && player1Mode === "guild") {
        pickTeam(g);
      } else if (selector === "P2" && player2Mode === "guild") {
        pickTeam(g);
      }
    });
    return () => sub.unsubscribe();
  }, [props.update$, pickTeam, selector, player1Mode, player2Mode]);

  const handleSelectList = async (selectedList: GBSavedListDoc) => {
    if (!gbdb) {
      alert("Database not available.");
      return;
    }

    const currentTeamDoc = selector === 'P1' ? teamDoc1 : teamDoc2;
    if (!currentTeamDoc) {
      alert(`Team document for ${selector} not available.`);
      return;
    }

    try {
      const modelDocsMap = await gbdb.models.findByIds(selectedList.modelIds).exec();
      const modelsArray = Array.from(modelDocsMap.values()).filter(Boolean) as GBModelDoc[];
      const rosterForGameState = modelsArray.map(model => ({ name: model.id, health: model.hp }));

      // Use selectedList.name as the 'guild' field when a list is chosen
      await currentTeamDoc.incrementalPatch({ roster: rosterForGameState, guild: selectedList.name });

      if (selector === 'P1') {
        setPlayer1ListName(selectedList.name);
        setTeam1(undefined); // Clear guild selection for P1
      } else {
        setPlayer2ListName(selectedList.name);
        setTeam2(undefined); // Clear guild selection for P2
      }

      // Turn switching logic
      if (selector === 'P1') {
        if (!(team2 || player2ListName) && !networkActive) { // Check if P2 has made any selection
          setSelector('P2');
        } else {
          setSelector('GO');
        }
      } else if (selector === 'P2') {
        if (!(team1 || player1ListName)) { // Check if P1 has made any selection
          setSelector('P1');
        } else {
          setSelector('GO');
        }
      }
    } catch (error) {
      console.error("Error selecting list:", error);
      alert(`Failed to select list "${selectedList.name}".`);
    }
  };

  const handlePlayerModeChange = async (player: "P1" | "P2", newMode: "guild" | "list" | null) => {
    if (!newMode) return;

    if (player === "P1") {
      setPlayer1Mode(newMode);
      if (newMode === 'guild') {
        setPlayer1ListName(undefined); // Clear list name
        // teamDoc1?.incrementalPatch({ roster: [] }); // Optionally clear roster
      } else { // newMode === 'list'
        await teamDoc1?.incrementalPatch({ guild: undefined, roster: [] }); // Clear guild and roster
        setTeam1(undefined); // Clear team1 state
      }
    } else { // Player P2
      setPlayer2Mode(newMode);
      if (newMode === 'guild') {
        setPlayer2ListName(undefined); // Clear list name
        // teamDoc2?.incrementalPatch({ roster: [] }); // Optionally clear roster
      } else { // newMode === 'list'
        await teamDoc2?.incrementalPatch({ guild: undefined, roster: [] }); // Clear guild and roster
        setTeam2(undefined); // Clear team2 state
      }
    }
  };

  const activePlayerIsListMode =
    (selector === 'P1' && player1Mode === 'list') ||
    (selector === 'P2' && player2Mode === 'list' && !networkActive);

  return (
    <>
      {activePlayerIsListMode && (
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          Currently selecting from: Saved List. (Guild selection is paused)
        </Typography>
      )}
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
        {/* Player 1 Area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
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
            {player1Mode === 'list' && player1ListName ? player1ListName.substring(0, 8) : (team1 ? <SelectedIcon team={team1} size={props.size} /> : "P1")}
          </Button>
          <ToggleButtonGroup
            value={player1Mode}
            exclusive
            onChange={(_event, newMode) => handlePlayerModeChange("P1", newMode as "guild" | "list" | null)}
            aria-label="Player 1 selection mode"
            size="small"
          >
            <ToggleButton value="guild" aria-label="select guild">
              Guild
            </ToggleButton>
            <ToggleButton value="list" aria-label="select list">
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* VS Area */}
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25em",
            alignSelf: 'flex-start', // Align with the top of the buttons
            marginTop: props.size / 2 - theme.spacing(3) // Adjust alignment
          }}
        >
          <Typography variant="caption">vs</Typography>
          <NavigateFab
            dest="Draft"
            disabled={!(team1 || player1ListName) || !(team2 || player2ListName)}
            onAction={() => setWaiting(true)}
            sx={{ m: "0 15px" }}
          />
          <Typography variant="caption">
            {waiting ? "(waiting)" : "\u00A0"}
          </Typography>
        </div>

        {/* Player 2 Area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
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
            {player2Mode === 'list' && player2ListName ? player2ListName.substring(0, 8) : (team2 ? <SelectedIcon team={team2} size={props.size} /> : "P2")}
          </Button>
          <ToggleButtonGroup
            value={player2Mode}
            exclusive
            onChange={(_event, newMode) => handlePlayerModeChange("P2", newMode as "guild" | "list" | null)}
            aria-label="Player 2 selection mode"
            size="small"
            disabled={networkActive}
          >
            <ToggleButton value="guild" aria-label="select guild">
              Guild
            </ToggleButton>
            <ToggleButton value="list" aria-label="select list">
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </div>

      {/* Saved Lists Display Area */}
      {((selector === "P1" && player1Mode === "list") || (selector === "P2" && player2Mode === "list" && !networkActive)) && (
        <Paper elevation={2} sx={{ mt: 2, p: 1, maxHeight: 200, overflow: 'auto', width: '80%', margin: '16px auto' }}>
          <Typography variant="h6" sx={{textAlign: 'center', mb:1}}>
            {selector === "P1" ? "Player 1: Select a Saved List" : "Player 2: Select a Saved List"}
          </Typography>
          {fetchedSavedLists.length > 0 ? (
            <List dense>
              {fetchedSavedLists.map((list) => (
                <ListItem
                  key={list.id}
                  button
                  onClick={() => handleSelectList(list)}
                >
                  <ListItemText primary={list.name} secondary={`Models: ${list.modelIds.length}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{textAlign: 'center'}}>No saved lists found.</Typography>
          )}
        </Paper>
      )}
    </>
  );
}

export default function TeamSelect() {
  const guilds = useLoaderData<GBGuildDoc[]>();
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
          <NetworkGame allowNew={true} />
        </div>
      </AppBarContent>
      <GuildGrid guilds={guilds} Controller={GameControls} />
      <VersionTag />
    </Box>
  );
}
