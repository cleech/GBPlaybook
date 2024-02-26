import React from "react";
import { useData } from "../components/DataContext";
import {
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
  Breadcrumbs,
  Box,
} from "@mui/material";

import { AppBarContent } from "../App";
import { useSettings } from "../models/settings";

const Settings = () => {
  const { manifest } = useData();
  const { settings, settingsDoc } = useSettings();

  if (!manifest || !settingsDoc) { return }

  return (
    <Box component={"main"} sx={{ p: "1rem" }}>
      <AppBarContent>
        <Breadcrumbs>
          <Typography>Settings</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <Typography variant="h6">
        GB Playbook {import.meta.env.VITE_VERSION}
      </Typography>
      <Typography variant="caption">({BUILD_DATE})</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography>Season and Erratra Version:</Typography>

      <FormControl>
        <Select
          value={settings.dataSet}
          onChange={(event: SelectChangeEvent) => {
            settingsDoc?.incrementalPatch({ dataSet: event.target.value });
          }}
        >
          {manifest?.datafiles.map((dataSet: any, index: number) => (
            <MenuItem value={dataSet.filename} key={index}>
              {`[${dataSet.version}] ${dataSet.description}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <Typography>UI Options:</Typography>

      <Typography>Initial Screen:</Typography>

      <FormControl>
        <Select
          value={settings.initialScreen}
          onChange={(event: SelectChangeEvent) => {
            settingsDoc?.incrementalPatch({
              initialScreen: event.target.value,
            });
          }}
        >
          <MenuItem value="/game">Game Play</MenuItem>
          <MenuItem value="/library">Card Library</MenuItem>
        </Select>
      </FormControl>

      <p />

      <FormControl>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={settings.uiPreferences.displayStatLine}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                settingsDoc?.incrementalPatch({
                  uiPreferences: { displayStatLine: event.target.checked },
                });
              }}
            />
          }
          label="Stat Line in Game Roster List"
        />
      </FormControl>

      <p />
      <Typography>Prefered Card Layout:</Typography>
      <Typography variant="subtitle2">
        (Only applies to updated cards, where both styles are available)
      </Typography>

      <FormControl>
        <Select
          value={settings.cardPreferences.preferredStyle}
          onChange={(event: SelectChangeEvent) => {
            settingsDoc?.incrementalPatch({
              cardPreferences: {
                preferredStyle: event.target.value as "sfg" | "gbcp",
              },
            });
          }}
        >
          <MenuItem value="sfg">Steamforged</MenuItem>
          <MenuItem value="gbcp">Community</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <Typography>Experimental Features:</Typography>
      <FormControl>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={settings.networkPlay}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                settingsDoc?.incrementalPatch({
                  networkPlay: event.target.checked,
                });
              }}
            />
          }
          label="Online Play"
        />
      </FormControl>
    </Box>
  );
};

export default Settings;
