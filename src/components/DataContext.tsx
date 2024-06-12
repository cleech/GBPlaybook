import React, { createContext, useState, useEffect } from "react";

import { useSettings } from "../hooks/useSettings";

import DataFile, { Manifest, Gameplan } from "./DataContext.d";

import gbdb, { GBDatabase, GBModel } from "../models/gbdb";
import i18n from "../utils/i18next";

interface DataContextProps {
  manifest?: Manifest;
  version: number;
  gameplans?: Gameplan[];
  gbdb?: GBDatabase;
}

export const DataContext = createContext<DataContextProps>({
  manifest: undefined,
  version: 0,
  gameplans: undefined,
});

interface DataProviderProps {
  children: React.ReactNode;
}

const gb_meta_local = "gbdata_meta";
export interface GBDataMeta {
  version: number;
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
    const me = manifest.datafiles.find((df) => df.filename === filename);
    const _sha256 = me?.sha256;
    const _version = me?.version;
    const dbSettings = await gbdb.getLocal<GBDataMeta>(gb_meta_local);
    if (dbSettings) {
      if (
        dbSettings.get("version") === _version &&
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
        gbdb.upsertLocal(gb_meta_local, {
          version: _version,
          filename: filename,
          sha256: _sha256,
        })
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
  const [version, setVersion] = useState(0);
  const [db, setDB] = useState<GBDatabase>();

  const { setting$ } = useSettings();
  const [dataSet, setDataSet] = useState<string | null>();
  const [lastSeenErrata, setMostRecent] = useState<string | null>();
  const [loadFile, setLoadFile] = useState<string | null>();
  const [language, setLang] = useState<string | null>();

  useEffect(() => {
    const sub = setting$?.subscribe((s) => {
      const { dataSet, language, mostRecentErrata } = s?.toJSON().data ?? {};
      setDataSet(dataSet ?? null);
      if (language == "auto") {
        setLang(i18n.resolvedLanguage ?? null);
      } else {
        setLang(language ?? null);
      }
      setMostRecent(mostRecentErrata ?? null);
    });
    return () => {
      sub?.unsubscribe();
    };
  }, [setting$]);

  useEffect(() => {
    if (dataSet === undefined || lastSeenErrata === undefined) return;
    let canceled = false;
    const getDataSet = async () => {
      const manifest = await readManifest();
      if (canceled) return;
      setManifest(manifest);

      const manifestZero = manifest.datafiles[0].filename;
      let filename: string;
      if (dataSet && lastSeenErrata === manifestZero) {
        filename = dataSet;
      } else {
        filename = manifestZero;
        const settingsDoc = await gbdb?.getLocal("settings");
        if (canceled) return;
        settingsDoc?.incrementalPatch({
          dataSet: filename,
          mostRecentErrata: manifestZero,
        });
      }

      const manifestEntry = manifest.datafiles.find(
        (d: (typeof manifest.datafiles)[0]) => d.filename === filename
      );
      const newVersion = manifestEntry.version;
      setVersion(newVersion);

      // check for translated data set
      if (language && manifestEntry.translations?.[language]) {
        console.log(`using translated data set (${language})`);
        filename = manifestEntry.translations[language].filename;
      }
      setLoadFile(filename);
    };
    getDataSet();
    return () => {
      canceled = true;
    };
  }, [dataSet, language, lastSeenErrata]);

  useEffect(() => {
    if (!loadFile || !manifest) return;
    let canceled = false;
    const getDataSet = async () => {
      const dataFile = await readFile(loadFile);
      if (canceled) return;
      setDB(undefined);
      await bulkLoadDB(loadFile, manifest, dataFile).then(() => setDB(gbdb));
      setGameplans(await readFile("gameplans.json"));
    };
    getDataSet();
    return () => {
      canceled = true;
    };
  }, [version, loadFile, manifest]);

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
