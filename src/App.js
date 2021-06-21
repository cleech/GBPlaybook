import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';

import {Provider as PaperProvider} from 'react-native-paper';
import _ from 'lodash';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {observer} from 'mobx-react-lite';
import {persist} from 'mst-persist';
import {createRootStore, StoreContext} from './stores/RootStore';

import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  DefaultTheme as PlayBookDefaultTheme,
  DarkTheme as PlayBookDarkTheme,
} from './components/Theme';

import {useColorScheme} from 'react-native';

const DefaultTheme = _.merge(
  {},
  PaperDefaultTheme,
  NavigationDefaultTheme,
  PlayBookDefaultTheme,
);
const DarkTheme = _.merge(
  {},
  PaperDarkTheme,
  NavigationDarkTheme,
  PlayBookDarkTheme,
);

const RootStore = createRootStore();
persist('GBPlaybook', RootStore, {storage: AsyncStorage, jsonify: true});

// const PERSISTANCE_KEY = 'PLAYBOOK_NAVIGATION_STATE';

// import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
// import {initDataFile, downloadManifest} from './components/GuildData';

import {DataProvider} from './components/DataContext';
import RootNavigation from './navigation/Navigation';

const App = observer(() => {
  // const [isReady, setIsReady] = useState(false);
  // const [initialState, setInitialState] = useState();
  const systemColor = useColorScheme();

  // useEffect(() => {
  // initDataFile();
  // downloadManifest();
  // });

  // useEffect(() => {
  //   const restoreState = async () => {
  //     try {
  //       const savedStateString = await AsyncStorage.getItem(PERSISTANCE_KEY);
  //       const state = savedStateString
  //         ? JSON.parse(savedStateString)
  //         : undefined;
  //       if (state !== undefined) {
  //         setInitialState(state);
  //       }
  //     } finally {
  //       setIsReady(true);
  //     }
  //   };
  //   if (!isReady) {
  //     restoreState();
  //   }
  // }, [isReady]);

  // if (!isReady) {
  //   return null;
  // }

  const colorScheme = RootStore.settings.colorScheme ?? systemColor;
  const Theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <StoreContext.Provider value={RootStore}>
      <DataProvider>
        <PaperProvider theme={Theme}>
          <SafeAreaProvider>
            {/* <StatusBar translucent={true} backgroundColor="transparent" /> */}
            <NavigationContainer
              theme={Theme}
              // initialState={initialState}
              // onStateChange={(state) =>
              //   AsyncStorage.setItem(PERSISTANCE_KEY, JSON.stringify(state))
              // }
            >
              <RootNavigation />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </DataProvider>
    </StoreContext.Provider>
  );
});

export default App;
