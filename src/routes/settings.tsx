import React from "react";
import { Observer } from "mobx-react-lite";
import { useStore } from "../models/Root";
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

const Settings = () => {
  const { manifest } = useData();
  const store = useStore();
  const settings = store.settings;

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
      <Observer>
        {() => (
          <FormControl>
            <Select
              value={settings.dataSet}
              onChange={(event: SelectChangeEvent) => {
                settings.setDataSet(event.target.value);
              }}
            >
              {manifest?.datafiles.map((dataSet: any, index: number) => (
                <MenuItem value={dataSet.filename} key={index}>
                  {`[${dataSet.version}] ${dataSet.description}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Observer>

      <Divider sx={{ my: 2 }} />

      <Typography>UI Options:</Typography>

      <Typography>Initial Screen:</Typography>
      <Observer>
        {() => (
          <FormControl>
            <Select
              value={settings.initialScreen}
              onChange={(event: SelectChangeEvent) => {
                settings.setInitialScreen(event.target.value);
              }}
            >
              <MenuItem value="/game">Game Play</MenuItem>
              <MenuItem value="/library">Card Library</MenuItem>
            </Select>
          </FormControl>
        )}
      </Observer>
      <p />
      <Observer>
        {() => (
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.uiPreferences.displayStatLine}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    settings.setStatLine(event.target.checked);
                  }}
                />
              }
              label="Stat Line in Game Roster List"
            />
          </FormControl>
        )}
      </Observer>
      <p />
      <Typography>Prefered Card Layout:</Typography>
      <Typography variant="subtitle2">
        (Only applies to updated cards, where both styles are available)
      </Typography>
      <Observer>
        {() => (
          <FormControl>
            <Select
              value={settings.cardPreferences.perferedStyled}
              onChange={(event: SelectChangeEvent) => {
                settings.setCardStyle(event.target.value);
              }}
            >
              <MenuItem value="sfg">Steamforged</MenuItem>
              <MenuItem value="gbcp">Community</MenuItem>
            </Select>
          </FormControl>
        )}
      </Observer>

      <Divider sx={{ my: 2 }} />

      <Typography>Experimental Features:</Typography>
      <Observer>
        {() => (
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.networkPlay}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    settings.setNetworkPlay(event.target.checked);
                  }}
                />
              }
              label="Online Play"
            />
          </FormControl>
        )}
      </Observer>
    </Box>
  );
};

export default Settings;
