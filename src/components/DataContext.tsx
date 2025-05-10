import React, { useState, useEffect } from "react";

import DataFile, { Manifest, Gameplan } from "./DataContext.d";

import { GBDatabase, GBModel, getGBDatabase } from "../models/gbdb";
import i18n from "../utils/i18next";
import { DataContext } from "../utils/contexts";
import { getSettings } from "../models/settings";
import { Subscription } from "rxjs";

export interface DataContextProps {
  manifest?: Manifest;
  version: number;
  gameplans?: Gameplan[];
  gbdb?: GBDatabase;
}

interface DataProviderProps {
  children: React.ReactNode;
}

const gb_meta_local = "gbdata_meta";
export interface GBDataMeta {
  version: number;
  filename: string;
  sha256: string;
}

let currentBulkLoadDBPromise: Promise<void> | null = null;

async function bulkLoadDB(
  filename: string,
  manifest: Manifest,
  data: DataFile
): Promise<void> {
  if (currentBulkLoadDBPromise) {
    console.log(`bulkLoadDB already in progress for ${filename}, returning existing promise.`);
    return currentBulkLoadDBPromise;
  }

  console.log(`Starting new bulkLoadDB operation for ${filename}`);
  const operationPromise = (async () => {
    const gbdb = await getGBDatabase();
    console.log(`loading ${filename}`);
    let _sha256 = undefined;
    let _version = undefined;
    const me = manifest.datafiles.find((df) => df.filename === filename);
    if (me) {
      _sha256 = me.sha256;
      _version = me.version;
    } else {
      console.log("looking for translation entry");
      for (const rev of manifest.datafiles) {
        const tr = rev.translations && Object.values(rev.translations).find(
          (df) => df.filename === filename
        );
        if (tr) {
          _sha256 = tr.sha256;
          _version = rev.version;
          break;
        }
      }
    }
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
            const error = new Error("Error loading Guilds: " + JSON.stringify(results.error));
            console.error(error);
            throw error;
          }
        })
        .catch(err => { console.error("Guilds loading failed:", err); throw err; }),
      gbdb.models
        .find()
        .exec()
        .then((ms) => gbdb.models.bulkRemove(ms.map((m) => m.id)))
        .then(() => gbdb.models.bulkInsert(data.Models as GBModel[]))
        .then((results) => {
          if (results.error.length !== 0) {
            const error = new Error("Error loading Models: " + JSON.stringify(results.error));
            console.error(error);
            throw error;
          }
        })
        .catch(err => { console.error("Models loading failed:", err); throw err; }),
      gbdb.character_plays
        .find()
        .exec()
        .then((cps) =>
          gbdb.character_plays.bulkRemove(cps.map((cp) => cp.name))
        )
        .then(() => gbdb.character_plays.bulkInsert(data["Character Plays"]))
        .then((results) => {
          if (results.error.length !== 0) {
            const error = new Error("Error loading Character Plays: " + JSON.stringify(results.error));
            console.error(error);
            throw error;
          }
        })
        .catch(err => { console.error("Character Plays loading failed:", err); throw err; }),
      gbdb.character_traits
        .find()
        .exec()
        .then((cts) =>
          gbdb.character_traits.bulkRemove(cts.map((ct) => ct.name))
        )
        .then(() => gbdb.character_traits.bulkInsert(data["Character Traits"]))
        .then((results) => {
          if (results.error.length !== 0) {
            const error = new Error("Error loading Character Traits: " + JSON.stringify(results.error));
            console.error(error);
            throw error;
          }
        })
        .catch(err => { console.error("Character Traits loading failed:", err); throw err; }),
    ])
      .then(() =>
        gbdb.upsertLocal(gb_meta_local, {
          version: _version,
          filename: filename,
          sha256: _sha256,
        })
      )
      .then(() => console.log("database re-load complete :|"));
  })();

  currentBulkLoadDBPromise = operationPromise;

  return currentBulkLoadDBPromise.finally(() => {
    if (currentBulkLoadDBPromise === operationPromise) {
      console.log(`bulkLoadDB operation for ${filename} finished. Clearing promise.`);
      currentBulkLoadDBPromise = null;
    }
  });
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [manifest, setManifest] = useState(undefined);
  const [gameplans, setGameplans] = useState(undefined);
  const [version, setVersion] = useState(0);
  const [db, setDB] = useState<GBDatabase>();

  const [dataSet, setDataSet] = useState<string | null>();
  const [lastSeenErrata, setMostRecent] = useState<string | null>();
  const [loadFile, setLoadFile] = useState<string | null>();
  const [language, setLang] = useState<string | null>();

  useEffect(() => {
    let sub: Subscription | undefined;
    (async () => {
      const setting$ = await getSettings();
      sub = setting$?.subscribe((s) => {
        const { dataSet, language, mostRecentErrata } = s?.toJSON().data ?? {};
        setDataSet(dataSet ?? null);
        if (language == "auto") {
          setLang(i18n.resolvedLanguage ?? null);
        } else {
          setLang(language ?? null);
        }
        setMostRecent(mostRecentErrata ?? null);
      });
    })();
    return () => sub?.unsubscribe();
  }, []);

  useEffect(() => {
    if (dataSet === undefined || lastSeenErrata === undefined) return;
    let canceled = false;
    const getDataSet = async () => {
      const manifest = await readFile('manifest.json');
      if (canceled) return;
      setManifest(manifest);

      const manifestZero = manifest.datafiles[0].filename;
      let filename: string;
      if (dataSet && lastSeenErrata === manifestZero) {
        filename = dataSet;
      } else {
        filename = manifestZero;
        const gbdb = await getGBDatabase();
        const settingsDoc = await gbdb.getLocal("settings");
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
      const gbdb = await getGBDatabase();
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

const readFile = async (filename: string) => {
  const result = await fetch(`data/${filename}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((response) => {
    return response.json();
  }).catch((err) => {
    console.error(err);
    throw new Error(`Unable to fetch ${filename}`);
  });
  return result;
};
