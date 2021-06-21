import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {DrawerActions} from '@react-navigation/native';
import {Appbar, withTheme} from 'react-native-paper';
import {useDimensions} from '@react-native-community/hooks';
import _ from 'lodash';

import {useStore} from '../stores/RootStore';
import {useData} from '../components/DataContext';
import TeamScreen from '../screens/TeamSelectScreen';
import DraftScreen from '../screens/DraftScreen';
import GameScreen from '../screens/GameScreen';
import LibraryScreen, {TeamLibrary} from '../screens/Library';
import SettingsView from '../screens/Settings';

const RootDrawer = createDrawerNavigator();
const GameStack = createStackNavigator();
const LibraryStackNav = createStackNavigator();
const SettingsStackNav = createStackNavigator();

const RootNavigation = withTheme(props => {
  const settings = useStore().settings;
  return (
    <RootDrawer.Navigator
      initialRouteName={settings.initialScreen}
      drawerType="slide"
      drawerPosition="right">
      <RootDrawer.Screen name="Game Play" component={MainStack} />
      <RootDrawer.Screen name="Library" component={LibraryStack} />
      <RootDrawer.Screen name="Settings" component={SettingsStack} />
    </RootDrawer.Navigator>
  );
});
export default RootNavigation;

const MainStack = withTheme(props => {
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

const LibraryStack = withTheme(props => {
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
        };
      }}>
      <LibraryStackNav.Screen
        name="Library"
        component={LibraryScreen}
        options={{headerLeft: () => <></>}}
      />
      {Guilds.map(g => (
        <LibraryStackNav.Screen
          key={g.name}
          name={g.name}
          component={TeamLibrary}
        />
      ))}
    </LibraryStackNav.Navigator>
  );
});

const SettingsStack = withTheme(props => {
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
