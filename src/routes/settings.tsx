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
  SelectChangeEvent,
} from "@mui/material";

const Settings = () => {
  const { loading, manifest } = useData();
  const store = useStore();
  const settings = store.settings;

  if (loading) {
    return null;
  }

  return (
    <main style={{}}>
      <Typography variant="h6">
        GB Playbook {process.env.REACT_APP_VERSION}
      </Typography>
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
              {manifest.datafiles.map((dataSet: any) => (
                <MenuItem value={dataSet.filename}>
                  {`[${dataSet.version}] ${dataSet.description}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Observer>
      <Divider sx={{ my: 2 }} />

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
              <MenuItem value="game">Game Play</MenuItem>
              <MenuItem value="library">Card Library</MenuItem>
            </Select>
          </FormControl>
        )}
      </Observer>
    </main>
  );
};

export default Settings;
