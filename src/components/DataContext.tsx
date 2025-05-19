import React, { useState, useEffect } from "react";

import { DataFile, Manifest, Gameplan, GBDataMeta } from "./DataTypes";

import { GBDatabase } from "../models/gbdbTypes";
import { getGBDatabase } from "../models/gbdb";
import i18n from "../utils/i18next";
import { DataContext } from "../utils/contexts";
import { SettingsDoc, getSettings } from "../models/settings";
import { Observable, firstValueFrom } from "rxjs";

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
        .then(() => gbdb.models.bulkInsert(data.Models))
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

let currentInitializationPromise: Promise<DataContextProps & { gbdb: GBDatabase }> | null = null;

export async function initializeAppData(): Promise<DataContextProps & { gbdb: GBDatabase }> {
  if (currentInitializationPromise) {
    console.log("Application data initialization already in progress, returning existing promise.");
    return currentInitializationPromise;
  }

  const initializationWork = async (): Promise<DataContextProps & { gbdb: GBDatabase }> => {
    console.log("Starting application data initialization.");

    const settingsObservable: Observable<SettingsDoc | null> | undefined = await getSettings();
    const settingsDoc = settingsObservable ? await firstValueFrom(settingsObservable) : null;
    const currentSettings = settingsDoc?.toJSON().data;

    const { dataSet, language: settingLanguage, mostRecentErrata } = currentSettings ?? {};

    const resolvedLang = i18n.resolvedLanguage;
    const effectiveLanguage = settingLanguage === "auto" || !settingLanguage ? resolvedLang : settingLanguage;

    const manifest: Manifest = await readFile('manifest.json');

    const manifestZeroFilename = manifest.datafiles[0].filename;
    let filenameToLoad: string;

    if (dataSet && mostRecentErrata === manifestZeroFilename) {
      filenameToLoad = dataSet;
    } else {
      filenameToLoad = manifestZeroFilename;
      const gbdbInstanceForSettings = await getGBDatabase();
      const localSettingsDoc = await gbdbInstanceForSettings.getLocal("settings");
      if (localSettingsDoc) {
        await localSettingsDoc.incrementalPatch({
          dataSet: filenameToLoad,
          mostRecentErrata: manifestZeroFilename,
        });
        console.log("Settings updated with latest dataSet and mostRecentErrata.");
      } else {
        console.warn("Settings document not found locally, cannot update dataSet/mostRecentErrata automatically.");
      }
    }

    const manifestEntry = manifest.datafiles.find(
      (d) => d.filename === filenameToLoad
    );

    if (!manifestEntry) {
      throw new Error(`Manifest entry not found for filename: ${filenameToLoad}`);
    }
    const version = manifestEntry.version;

    let finalFilenameToLoad = filenameToLoad;
    if (effectiveLanguage && manifestEntry.translations?.[effectiveLanguage]) {
      console.log(`Using translated data set (${effectiveLanguage})`);
      finalFilenameToLoad = manifestEntry.translations[effectiveLanguage].filename;
    }

    const dataFile = await readFile(finalFilenameToLoad);
    const gbdb = await getGBDatabase();
    await bulkLoadDB(finalFilenameToLoad, manifest, dataFile);

    const gameplans: Gameplan[] = await readFile("gameplans.json");

    console.log("Application data initialization complete.");
    return { manifest, version, gameplans, gbdb };
  };

  currentInitializationPromise = initializationWork();
  const promiseToReturn = currentInitializationPromise;

  promiseToReturn.finally(() => {
    if (currentInitializationPromise === promiseToReturn) {
      currentInitializationPromise = null;
      console.log("Cleared currentInitializationPromise after initialization.");
    }
  }).catch(() => {
    // Ensure clearance on error too, if not already cleared by finally
    if (currentInitializationPromise === promiseToReturn) {
      currentInitializationPromise = null;
      console.log("Cleared currentInitializationPromise after an error during initialization.");
    }
  });

  return promiseToReturn;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [dataContextValue, setDataContextValue] = useState<DataContextProps>({
    manifest: undefined,
    version: 0,
    gameplans: undefined,
    gbdb: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    const loadAppData = async () => {
      setIsLoading(true);
      try {
        const initializedData = await initializeAppData();
        if (!canceled) {
          setDataContextValue(initializedData);
        }
      } catch (error) {
        console.error("Failed to initialize application data in DataProvider:", error);
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    };
    loadAppData();
    return () => {
      canceled = true;
    };
  }, []); // Run once on mount

  if (isLoading) {
    // You might want to render a loading spinner or null here
    return <div>Loading application data...</div>;
  }

  return (
    <DataContext.Provider value={dataContextValue}>
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
  }).then(async (response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  }).catch((err) => {
    console.error(err);
    throw new Error(`Unable to fetch ${filename}`);
  });
  return result;
};
