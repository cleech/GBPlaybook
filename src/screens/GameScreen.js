import React, {useState} from 'react';
import {View, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RosterList from '../components/RosterList';

import {useStore} from '../stores/RootStore';

// import NavRail from '../components/NavRail';
import {Appbar, Text} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';

import {
  useDeviceOrientation,
  useDimensions,
} from '@react-native-community/hooks';

function PortraitView(props) {
  const store = useStore();

  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom', 'left', 'right']}>
      <RosterList teams={[store.team1, store.team2]} />
    </SafeAreaView>
  );
}

function LandscapeView(props) {
  const store = useStore();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        {/* <NavRail>
          <Appbar.BackAction
            onPress={() => props.navigation.dispatch(CommonActions.goBack())}
          />
          <Text />
          <Appbar.Action
            icon="play-circle-outline"
            onPress={() => {
              props.navigation.navigate('Game Play');
            }}
          />
          <Text style={{textAlign: 'center'}}>Game Manager</Text>
          <Appbar.Action
            icon="cards-outline"
            onPress={() => {
              props.navigation.navigate('Library');
            }}
          />
          <Text style={{textAlign: 'center'}}>Card Library</Text>
          <Appbar.Action
            icon="cogs"
            onPress={() => {
              props.navigation.navigate('Settings');
            }}
          />
          <Text style={{textAlign: 'center'}}>Settings</Text>
        </NavRail> */}
        <RosterList teams={[store.team1]} />
        <RosterList teams={[store.team2]} />
      </View>
    </SafeAreaView>
  );
}

export default function GameScreen(props) {
  // const orientation = useDeviceOrientation();
  const {height, width} = useDimensions().window;
  const landscape = width > height;

  if (landscape) {
    return <LandscapeView {...props} />;
  } else {
    return <PortraitView {...props} />;
  }
}
