import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import TeamScreen from './screens/TeamSelectScreen';
import DraftScreen from './screens/DraftScreen';
import GameScreen from './screens/GameScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';

import {Provider as PaperProvider, Text} from 'react-native-paper';
import {useDimensions} from '@react-native-community/hooks';
import _ from 'lodash';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {observer} from 'mobx-react-lite';
import {persist} from 'mst-persist';
import {createRootStore, StoreContext} from './stores/RootStore';

// import SegmentedControl from '@react-native-segmented-control/segmented-control';

import SettingsView from './screens/Settings';

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

const RootDrawer = createDrawerNavigator();
const GameStack = createStackNavigator();
const LibraryStackNav = createStackNavigator();
const SettingsStackNav = createStackNavigator();

import {
  Appbar,
  Menu,
  Divider,
  RadioButton,
  Button,
  withTheme,
} from 'react-native-paper';
import {DrawerActions} from '@react-navigation/native';

const SettingsMenu = withTheme(
  observer((props) => {
    const [isVisible, setVisible] = useState(false);
    return (
      <Menu
        visible={isVisible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            color={props.theme.colors.text}
            onPress={() => setVisible(true)}
          />
        }>
        <Menu.Item title="Theme" />
        <Divider />
        <RadioButton.Group
          value={RootStore.settings.colorScheme}
          onValueChange={(newValue) =>
            RootStore.settings.setColorScheme(newValue)
          }>
          <RadioButton.Item label="Follow System Settings" value={undefined} />
          <RadioButton.Item label="Default Theme" value="light" />
          <RadioButton.Item label="Dark Theme" value="dark" />
        </RadioButton.Group>
        <Divider />
        <Button
          onPress={() => {
            props.navigation.navigate('TeamSelect');
            RootStore.reset();
          }}>
          Reset
        </Button>
      </Menu>
    );
  }),
);

const RootRouteNames = ['Library', 'Game Play', 'Settings'];
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const MainStack = withTheme((props) => {
  const [segmentIndex, setSegmentIndex] = useState(1);
  const {height, width} = useDimensions().window;
  const landscape = width > height;
  return (
    <GameStack.Navigator
      initialRouteName="TeamSelect"
      screenOptions={({navigation, route}) => {
        return {
          headerShown: !landscape,          
          headerBackTitleVisible: false,
          headerRight: () => (
            <Appbar.Action
              icon="menu"
              color={props.theme.colors.text}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          ),
          headerTitle: 'GB Playbook',
          // headerRight: () => <SettingsMenu navigation={navigation} />,
          // ...(!navigation.canGoBack() && {headerLeft: () => <></>}),
          // headerRight: () => <></>,          
          // headerTitle: () => (
          //   <>            
          //     <SegmentedControl
          //       style={{width: 300}}
          //       values={['Cards', 'Game', 'Settings']}
          //       selectedIndex={segmentIndex}
          //       // selectedIndex={RootRouteNames.find(navigation.)}
          //       onChange={(event) => {
          //         let index = event.nativeEvent.selectedSegmentIndex;
          //         // setSegmentIndex(index);
          //         props.navigation.navigate(RootRouteNames[index]);
          //       }}
          //     />            
          //   </>
          // ),
        };
      }}>
      <GameStack.Screen
        name="TeamSelect"
        component={TeamScreen}
        options={{headerLeft: () => <></>}}
      />
      <GameStack.Screen name="Draft" component={DraftScreen} />
      <GameStack.Screen name="Game" component={GameScreen} />
    </GameStack.Navigator>
  );
});

import LibraryScreen, {TeamLibrary} from './screens/Library';

const LibraryStack = withTheme((props) => {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const {height, width} = useDimensions().window;
  const landscape = width > height;

  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  return (
    <LibraryStackNav.Navigator
      initialRouteName="Library"
      screenOptions={({navigation}) => {
        return {
          headerShown: !landscape,
          headerBackTitleVisible: false,          
          headerRight: () => (
            <Appbar.Action
              icon="menu"
              color={props.theme.colors.text}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          ),
          // headerTitle: 'Card Library',

          // headerLeft: () => (
          //   <Appbar.Action
          //     icon="menu"
          //     color={props.theme.colors.text}
          //     onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          //   />
          // ),
          // headerRight: () => <SettingsMenu />,
          // headerTitle: () => <SegmentedControl values={['Game', 'Library']} />,
          // ...(!(navigation.isFocused() && navigation.canGoBack()) && {
          //   headerLeft: () => <></>,
          // }),
          // headerLeft: () => <></>,
          // headerRight: () => <></>,
          // headerTitle: () => (
          //   <SegmentedControl
          //     values={['Cards', 'Game', 'Settings']}
          //     selectedIndex={segmentIndex}
          //     // selectedIndex={RootRouteNames.find(navigation.)}
          //     onChange={(event) => {
          //       let index = event.nativeEvent.selectedSegmentIndex;
          //       // setSegmentIndex(index);
          //       props.navigation.navigate(RootRouteNames[index]);
          //     }}
          //   />
          // ),
        };
      }}>
      <LibraryStackNav.Screen
        name='Library'
        component={LibraryScreen}
        options={{headerLeft: () => <></>}}
      />
      {Guilds.map((g) => (
        <LibraryStackNav.Screen
          key={g.name}
          name={g.name}
          component={TeamLibrary}
        />
      ))}
    </LibraryStackNav.Navigator>
  );
});

const SettingsStack = withTheme((props) => {
  const [segmentIndex, setSegmentIndex] = useState(2);
  const {height, width} = useDimensions().window;
  const landscape = width > height;
  return (
    <SettingsStackNav.Navigator
      initialRouteName="Library"
      screenOptions={({navigation}) => {
        return {
          headerShown: !landscape,
          headerBackTitleVisible: false,
          headerRight: () => (
            <Appbar.Action
              icon="menu"
              color={props.theme.colors.text}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          ),
          // headerRight: () => <></>,
          // headerTitle: () => (
          //   <SegmentedControl
          //     values={['Cards', 'Game', 'Settings']}
          //     selectedIndex={segmentIndex}
          //     onChange={(event) => {
          //       let index = event.nativeEvent.selectedSegmentIndex;
          //       // setSegmentIndex(index);
          //       props.navigation.navigate(RootRouteNames[index]);
          //     }}
          //   />
          // ),
        };
      }}>
      <SettingsStackNav.Screen
        name="Settings"
        component={SettingsView}
        options={{headerLeft: () => <></>}}
      />
    </SettingsStackNav.Navigator>
  );
});

// import Guilds from './components/GuildData';
import {useData} from './components/DataContext';

const PERSISTANCE_KEY = 'PLAYBOOK_NAVIGATION_STATE';

import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
// import {initDataFile, downloadManifest} from './components/GuildData';

import {DataProvider} from './components/DataContext';

const App = observer(() => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const systemColor = useColorScheme();

  useEffect(() => {
    // initDataFile();
    // downloadManifest();
  });

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
              initialState={initialState}
              onStateChange={(state) =>
                AsyncStorage.setItem(PERSISTANCE_KEY, JSON.stringify(state))
              }>
              <RootDrawer.Navigator
                initialRouteName={RootStore.settings.initialScreen}
                drawerType='slide'
                drawerPosition='right'                
              >
                <RootDrawer.Screen name="Game Play" component={MainStack} />
                <RootDrawer.Screen name="Library" component={LibraryStack} />
                <RootDrawer.Screen name="Settings" component={SettingsStack} />
              </RootDrawer.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </DataProvider>
    </StoreContext.Provider>
  );
});

export default App;
