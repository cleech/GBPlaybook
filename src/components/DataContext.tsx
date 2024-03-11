import React, { createContext, useState, useEffect, useCallback } from "react";

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

async function bulkLoadDB(
  filename: string,
  manifest: Manifest,
  data: DataFile
) {
  const _sha256 = manifest.datafiles.find(
    (df) => df.filename === filename
  )?.sha256;
  const dbSettings = await gbdb.getLocal<GBDataMeta>(gb_meta_local);
  if (dbSettings) {
    if (
      dbSettings.get("filename") === filename &&
      dbSettings.get("sha256") === _sha256
    ) {
      // console.log("database pre-loaded :)");
      return;
    }
  }
  // console.log("database re-loading :(");
  await Promise.all([
    gbdb.guilds
      .find()
      .exec()
      .then((gs) => gbdb.guilds.bulkRemove(gs.map((g) => g.name)))
      .then(() => gbdb.guilds.bulkInsert(data.Guilds)),
    gbdb.models
      .find()
      .exec()
      .then((ms) => gbdb.guilds.bulkRemove(ms.map((m) => m.id)))
      .then(() => gbdb.models.bulkInsert(data.Models as GBModel[])),
    gbdb.character_plays
      .find()
      .exec()
      .then((cps) => gbdb.guilds.bulkRemove(cps.map((cp) => cp.name)))
      .then(() => gbdb.character_plays.bulkInsert(data["Character Plays"])),
    gbdb.character_traits
      .find()
      .exec()
      .then((cts) => gbdb.guilds.bulkRemove(cts.map((ct) => ct.name)))
      .then(() => gbdb.character_traits.bulkInsert(data["Character Traits"])),
  ])
    .then(() =>
      gbdb.upsertLocal(gb_meta_local, { filename: filename, sha256: _sha256 })
    )
    // .then(() => console.log("database re-load complete :|"))
    .catch(console.error);
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
  });
  // const filename = settings.dataSet;

  const getData = useCallback(async () => {
    const manifest = await readManifest();
    setManifest(manifest);
    let filename: string;
    if (dataSet) {
      // filename = manifest.datafiles.find((d) => d.filename === settings.dataSet).filename;
      filename = dataSet;
    } else {
      filename = manifest.datafiles[0].filename;
      const settingsDoc = await db?.getLocal("settings");
      settingsDoc?.incrementalPatch({ dataSet: filename });
    }
    setVersion(
      manifest.datafiles.find(
        (d: (typeof manifest.datafiles)[0]) => d.filename === filename
      ).version
    );
    readFile(filename).then((data) => {
      setDB(undefined);
      bulkLoadDB(filename, manifest, data).then(() => setDB(gbdb));
    });
    setGameplans(await readFile("gameplans.json"));
  }, [db, dataSet]);

  useEffect(() => {
    getData();
  }, [dataSet, getData]);

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
