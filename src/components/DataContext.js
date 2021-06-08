import React, {createContext, useContext, useState, useEffect} from 'react';

const DataContext = createContext();

import {observer} from 'mobx-react-lite';
import {useStore} from '../stores/RootStore';

export const DataProvider = observer(({children}) => {
  const [loading, setLoading] = useState(true);
  const [manifest, setManifest] = useState(null);
  const [data, setData] = useState(null);
  const [version, setVersion] = useState('');

  const settings = useStore().settings;
  const filename = settings.dataSet;

  // console.log('DataProvider render');

  const getData = async () => {
    setLoading(true);
    const manifest = await readManifest();
    setManifest(manifest);
    var filename;
    if (settings.dataSet) {
      // filename = manifest.datafiles.find((d) => d.filename === settings.dataSet).filename;
      filename = settings.dataSet;
    } else {
      filename = manifest.datafiles[0].filename;
      settings.setDataSet(filename);
    }
    setVersion(manifest.datafiles.find((d) => d.filename === filename).version);
    setData(await readFile(filename));
    setLoading(false);
  };

  useEffect(() => {
    // console.log('reloading dataSet');
    getData();
  }, [filename]);

  return (
    <DataContext.Provider value={{loading, data, version, manifest}}>
      {children}
    </DataContext.Provider>
  );
});

export const useData = () => {
  return useContext(DataContext);
};

import FS from 'react-native-fs';
import {Platform} from 'react-native';

const readManifest = async () => {  
  let data = await Platform.select({
    ios: async () => await FS.readFile(`${FS.MainBundlePath}/manifest.json`),
    android: async () => await FS.readFileAssets('custom/manifest.json'),
  })();
  let manifest = JSON.parse(data);
  return manifest;
};

const readFile = async (filename) => {  
  let data = await Platform.select({
    ios: async () => await FS.readFile(`${FS.MainBundlePath}/${filename}`),
    android: async () => await FS.readFileAssets(`custom/${filename}`),
  })();
  let result = JSON.parse(data);
  return result;
};
