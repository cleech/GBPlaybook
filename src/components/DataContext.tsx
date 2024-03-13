import React, { createContext, useState, useEffect } from "react";

import { useSettings } from "../hooks/useSettings";

import DataFile, { Manifest, Gameplan } from "./DataContext.d";

import gbdb, { GBDatabase, GBModel } from "../models/gbdb";
import { map } from "rxjs";

interface DataContextProps {
  manifest?: Manifest;
  version: string;
  gameplans?: Gameplan[];
  gbdb?: GBDatabase;
}

export const DataContext = createContext<DataContextProps>({
  manifest: undefined,
  version: "0",
  gameplans: undefined,
});

interface DataProviderProps {
  children: React.ReactNode;
}

const gb_meta_local = "gbdata_meta";
interface GBDataMeta {
  filename: string;
  sha256: string;
}

let reloadInProgress = false;

async function bulkLoadDB(
  filename: string,
  manifest: Manifest,
  data: DataFile
) {
  if (reloadInProgress) {
    console.error("concurent reloads");
    return;
  }
  console.log(`loading ${filename}`);
  reloadInProgress = true;
  try {
    const _sha256 = manifest.datafiles.find(
      (df) => df.filename === filename
    )?.sha256;
    const dbSettings = await gbdb.getLocal<GBDataMeta>(gb_meta_local);
    if (dbSettings) {
      if (
        dbSettings.get("filename") === filename &&
        dbSettings.get("sha256") === _sha256
      ) {
        console.log("database pre-loaded :)");
        return;
      }
    }
    console.log("database re-loading :(");
    await Promise.all([
      gbdb.guilds
        .find()
        .exec()
        .then((gs) => gbdb.guilds.bulkRemove(gs.map((g) => g.name)))
        .then(() => gbdb.guilds.bulkInsert(data.Guilds))
        .then((results) => {
          if (results.error.length !== 0) {
            throw "error loading Guilds";
          }
        })
        .catch(console.error),
      gbdb.models
        .find()
        .exec()
        .then((ms) => gbdb.models.bulkRemove(ms.map((m) => m.id)))
        .then(() => gbdb.models.bulkInsert(data.Models as GBModel[]))
        .then((results) => {
          if (results.error.length !== 0) {
            throw "error loading Models";
          }
        })
        .catch(console.error),
      gbdb.character_plays
        .find()
        .exec()
        .then((cps) =>
          gbdb.character_plays.bulkRemove(cps.map((cp) => cp.name))
        )
        .then(() => gbdb.character_plays.bulkInsert(data["Character Plays"]))
        .then((results) => {
          if (results.error.length !== 0) {
            throw "error loading Character Plays";
          }
        })
        .catch(console.error),
      gbdb.character_traits
        .find()
        .exec()
        .then((cts) =>
          gbdb.character_traits.bulkRemove(cts.map((ct) => ct.name))
        )
        .then(() => gbdb.character_traits.bulkInsert(data["Character Traits"]))
        .then((results) => {
          if (results.error.length !== 0) {
            throw "error loading Character Traits";
          }
        })
        .catch(console.error),
    ])
      .then(() =>
        gbdb.upsertLocal(gb_meta_local, { filename: filename, sha256: _sha256 })
      )
      .then(() => console.log("database re-load complete :|"))
      .catch(console.error);
  } finally {
    reloadInProgress = false;
  }
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [manifest, setManifest] = useState(undefined);
  const [gameplans, setGameplans] = useState(undefined);
  const [version, setVersion] = useState("");
  const [db, setDB] = useState<GBDatabase>();

  const { setting$ } = useSettings();
  const [dataSet, setDataSet] = useState<string>();

  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.dataSet))
      .subscribe((ds) => setDataSet(ds));
    return () => {
      sub?.unsubscribe();
    };
  }, [setting$]);

  useEffect(() => {
    let canceled = false;
    const getDataSet = async () => {
      const manifest = await readManifest();
      if (canceled) return;
      setManifest(manifest);
      let filename: string;
      if (dataSet) {
        // filename = manifest.datafiles.find((d) => d.filename === settings.dataSet).filename;
        filename = dataSet;
      } else {
        filename = manifest.datafiles[0].filename;
        const settingsDoc = await gbdb?.getLocal("settings");
        if (canceled) return;
        settingsDoc?.incrementalPatch({ dataSet: filename });
      }
      const newVersion = manifest.datafiles.find(
        (d: (typeof manifest.datafiles)[0]) => d.filename === filename
      ).version;
      setVersion(newVersion);

      const dataFile = await readFile(filename);
      if (canceled) return;
      setDB(undefined);
      await bulkLoadDB(filename, manifest, dataFile).then(() => setDB(gbdb));
      setGameplans(await readFile("gameplans.json"));
    };
    getDataSet();
    return () => {
      canceled = true;
    };
  }, [dataSet]);

  return (
    <DataContext.Provider value={{ version, manifest, gameplans, gbdb: db }}>
      {children}
    </DataContext.Provider>
  );
};

const readManifest = async () => {
  const manifest = await fetch("data/manifest.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
  return manifest;
};

const readFile = async (filename: string) => {
  const result = await fetch(`data/${filename}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
  return result;
};
