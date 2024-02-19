import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { observer } from "mobx-react-lite";
import { useStore } from "../models/Root";

import DataFile, { Manifest, Gameplan } from "./DataContext.d";

import gbdb, { GBDatabase } from "../models/gbdb";

interface DataContextProps {
  manifest?: Manifest;
  version: string;
  gameplans?: Gameplan[];
  gbdb?: GBDatabase;
}

const DataContext = createContext<DataContextProps>({
  manifest: undefined,
  version: "0",
  gameplans: undefined,
});

interface DataProviderProps {
  children: React.ReactNode;
}

type GBDBSettings = {
  filename: string;
  sha256: string;
};

async function bulkLoadDB(
  filename: string,
  manifest: Manifest,
  data: DataFile
) {
  const _sha256 = manifest.datafiles.find(
    (df) => df.filename === filename
  )?.sha256;
  const dbSettings = await gbdb.getLocal("settings");
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
      .then(() => gbdb.models.bulkInsert(data.Models)),
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
    // .then(() => console.log("re-load complete :|"))
    .then(() =>
      gbdb.upsertLocal("settings", { filename: filename, sha256: _sha256 })
    );
}

export const DataProvider = observer(({ children }: DataProviderProps) => {
  const [manifest, setManifest] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [gameplans, setGameplans] = useState(undefined);
  const [version, setVersion] = useState("");
  const [db, setDB] = useState<GBDatabase>();

  const settings = useStore().settings;
  const filename = settings.dataSet;

  // console.log('DataProvider render');

  const getData = useCallback(async () => {
    const manifest = await readManifest();
    setManifest(manifest);
    var filename: string;
    if (settings.dataSet) {
      // filename = manifest.datafiles.find((d) => d.filename === settings.dataSet).filename;
      filename = settings.dataSet;
    } else {
      filename = manifest.datafiles[0].filename;
      settings.setDataSet(filename);
    }
    setVersion(
      manifest.datafiles.find(
        (d: (typeof manifest.datafiles)[0]) => d.filename === filename
      ).version
    );
    readFile(filename).then((data) => {
      setDB(undefined);
      bulkLoadDB(filename, manifest, data).then(() => setDB(gbdb));
      setData(data);
    });
    setGameplans(await readFile("gameplans.json"));
  }, [settings]);

  useEffect(() => {
    // console.log(`reloading dataSet: ${filename}`);
    getData();
  }, [filename, getData]);

  return (
    <DataContext.Provider value={{ version, manifest, gameplans, gbdb: db }}>
      {children}
    </DataContext.Provider>
  );
});

export const useData = () => {
  return useContext(DataContext);
};

const readManifest = async () => {
  let manifest = await fetch("data/manifest.json", {
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
  let result = await fetch(`data/${filename}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
  return result;
};
