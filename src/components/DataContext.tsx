import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { observer } from "mobx-react-lite";
import { useStore } from "../models/Root";

import DataFile, { Manifest } from "./DataContext.d";

interface DataContextProps {
  loading: boolean;
  manifest?: Manifest;
  data?: DataFile;
  version: string;
}

const DataContext = createContext<DataContextProps>({
  loading: false,
  manifest: undefined,
  data: undefined,
  version: "0",
});

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider = observer(({ children }: DataProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [manifest, setManifest] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [version, setVersion] = useState("");

  const settings = useStore().settings;
  const filename = settings.dataSet;

  // console.log('DataProvider render');

  const getData = useCallback(async () => {
    setLoading(true);
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
        (d: typeof manifest.datafiles[0]) => d.filename === filename
      ).version
    );
    setData(await readFile(filename));
    setLoading(false);
  }, [settings]);

  useEffect(() => {
    // console.log(`reloading dataSet: ${filename}`);
    getData();
  }, [filename, getData]);

  return (
    <DataContext.Provider value={{ loading, data, version, manifest }}>
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
