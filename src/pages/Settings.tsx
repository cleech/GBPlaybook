import React, { useEffect, useState } from "react";
import { useData } from "../hooks/useData";
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

import { AppBarContent } from "./App";
import { SettingsDoc } from "../models/settings";
import { useTranslation } from "react-i18next";
import { Observable } from "rxjs";
import ISO6391 from "iso-639-1";
import { useRouteLoaderData } from "react-router-dom";
import { defaultSettings } from "../models/defaultSettings";

const SettingsSwitch = ({ value$, onChange, label }:
  {
    value$: Observable<boolean>,
    onChange: (checked: boolean) => void
    label: string | undefined
  }) => {

  const [value, setValue] = useState<boolean>(false);
  useEffect(() => {
    const observer = value$.subscribe((v) => setValue(v));
    return () => observer?.unsubscribe();
  }, [value$]);

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(event.target.checked);
            }}
          />
        }
        label={label}
      />
    </FormControl>
  );
}

const Settings = () => {
  const { reloadData, manifest } = useData();
  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage;

  const [settingsDoc, setSettingsDoc] = useState<SettingsDoc | null>();
  useEffect(() => {
    const sub = setting$?.subscribe((s) => setSettingsDoc(s));
    return () => sub?.unsubscribe();
  }, [setting$]);

  if (!manifest || !settingsDoc) {
    return null;
  }

  return (
    <Box component={"main"} sx={{
      p: "1rem", overflow: "auto",
      // background: "rgba(100%, 100%, 100%, 5%)",
      // backdropFilter: "blur(5px)",
    }}>
      <AppBarContent>
        <Breadcrumbs>
          <Typography>Settings</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <Typography variant="h6">
        GB Playbook
      </Typography>
      <Typography variant="caption">({BUILD_DATE})</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography>Season and Errata Version:</Typography>

      <FormControl>
        <Select
          value={settingsDoc.toJSON().data.dataSet}
          onChange={async (event: SelectChangeEvent) => {
            const newDataSet = event.target.value;
            if (settingsDoc) {
              await settingsDoc.incrementalModify((doc) => {
                doc.dataSet = newDataSet;
                doc.gamePlayRoute = defaultSettings.gamePlayRoute;
                doc.libraryRoute = defaultSettings.libraryRoute;
                return doc;
              });
              await reloadData();
            }
          }}
        >
          {manifest?.datafiles.map((dataSet, index: number) => (
            <MenuItem value={dataSet.filename} key={index}>
              {`[${dataSet.version}] ${dataSet.description}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <p />

      <Typography>Language Preference</Typography>
      <Typography variant="subtitle2">
        (available languages vary by Season and Errata setting)
      </Typography>
      <FormControl>
        <Select
          value={settingsDoc.toJSON().data.language ?? "auto"}
          onChange={async (event: SelectChangeEvent) => {
            const newLanguage = event.target.value;
            if (settingsDoc) {
              await settingsDoc.incrementalModify((doc) => {
                doc.language = newLanguage;
                doc.gamePlayRoute = defaultSettings.gamePlayRoute;
                doc.libraryRoute = defaultSettings.libraryRoute;
                return doc;
              });
              await reloadData();
            }
          }}
        >
          <MenuItem value="auto" key="auto">
            {`Automatic Detection (${ISO6391.getNativeName(lng ?? "en")})`}
          </MenuItem>
          {["en"]
            .concat(
              Object.keys(
                manifest.datafiles.find(
                  (d) => d.filename === settingsDoc.toJSON().data.dataSet
                )?.translations ?? {}
              )
            )
            .map((lang, index: number) => (
              <MenuItem value={lang} key={index}>
                {`${ISO6391.getNativeName(lang)}`}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <Typography>UI Options:</Typography>

      <p />
      <Typography>Initial Screen:</Typography>
      <FormControl>
        <Select
          value={settingsDoc?.toJSON().data.initialScreen}
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
      <SettingsSwitch
        value$={settingsDoc.get$("uiPreferences.displayStatLine")}
        label="Stat Line in Game Roster List"
        onChange={(checked) => settingsDoc?.incrementalPatch(
          { uiPreferences: { displayStatLine: checked } }
        )} />

      <p />
      <SettingsSwitch
        value$={settingsDoc.get$("cardPreferences.improveReadability")}
        label="Remove guild logo from card back to improve legibility"
        onChange={(checked) => settingsDoc?.incrementalModify((doc) => {
          doc.cardPreferences.improveReadability = checked;
          return doc;
        })} />

      <p />
    </Box>
  );
};

export default Settings;
