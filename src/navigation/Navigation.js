import React, {useEffect} from 'react';
import {View, Image, Linking} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {CommonActions, DrawerActions} from '@react-navigation/native';
import {Divider, Appbar, List, withTheme} from 'react-native-paper';
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

const DrawerContent = props => (
  <DrawerContentScrollView {...props}>
    <List.Item
      title="GB Playbook"
      left={() => (
        <Image
          source={require('../assets/img/logo.png')}
          style={{borderRadius: 5.4}}
        />
      )}
    />
    <Divider style={{marginHorizontal: 10}} />
    <DrawerItemList {...props} />
    <Divider style={{margin: 10}} />
    <List.Subheader>External Resources:</List.Subheader>
    <View style={{marginLeft: 20}}>
      <DrawerItem
        label="Core Rules"
        onPress={() =>
          Linking.openURL(
            'https://www.longshanks.org/tools/documents/rules/rules_s4.pdf',
          )
        }
      />
      <DrawerItem
        label="Organized Play Rules"
        onPress={() =>
          Linking.openURL('https://www.longshanks.org/tools/documents/opd/')
        }
      />
    </View>
    <Divider style={{margin: 10}} />
    <List.Subheader>Community Links:</List.Subheader>
    <View style={{marginLeft: 20}}>
      <DrawerItem
        label="GBCP Discord"
        onPress={() => Linking.openURL('https://discord.gg/eMZeVQkn3P')}
      />
      <DrawerItem
        label="Longshanks"
        onPress={() => Linking.openURL('https://www.longshanks.org/')}
      />
    </View>
  </DrawerContentScrollView>
);

const RootNavigation = props => {
  const settings = useStore().settings;
  return (
    <RootDrawer.Navigator
      initialRouteName={settings.initialScreen}
      drawerType="slide"
      drawerPosition="right"
      drawerContent={DrawerContent}>
      <RootDrawer.Screen name="Game Play" component={MainStack} />
      <RootDrawer.Screen name="Library" component={LibraryStack} />
      <RootDrawer.Screen name="Settings" component={SettingsStack} />
    </RootDrawer.Navigator>
  );
};
export default RootNavigation;

const MainStack = withTheme(props => {
  const {height, width} = useDimensions().window;
  const landscape = width > height;
  const {version} = useData();

  // reset the stack on context change
  useEffect(() => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'TeamSelect'}],
      }),
    );
  }, [version]);

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

  const {data, version, loading} = useData();

  // I thought this might be needed, but it doesn't work here
  // maybe becuase the routes are calculated?
  // useEffect(() => {
  //   props.navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{name: 'Library'}],
  //     }),
  //   );
  // }, [version]);

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
