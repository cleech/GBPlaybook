import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {FAB} from 'react-native-paper';

import {
  useDeviceOrientation,
  useDimensions,
} from '@react-native-community/hooks';

// import Guilds from '../components/GuildData';
import GBIcons from '../components/GBIcons';

import {DraftList, BlacksmithDraftList} from '../components/DraftList';

import {useStore} from '../stores/RootStore';
import {Observer} from 'mobx-react-lite';

import {useTheme} from '@react-navigation/native';

// import NavRail from '../components/NavRail';
import {Text, Appbar} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';

import {useData} from '../components/DataContext';

const DraftScreen = (props) => {
  const store = useStore();
  const theme = useTheme();

  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  let guild1 = store.team1.name;
  let guild2 = store.team2.name;

  // const orientation = useDeviceOrientation();
  const {height, width} = useDimensions().window;
  const landscape = width > height;

  let Team1DraftList =
    guild1 === 'Blacksmiths' ? BlacksmithDraftList : DraftList;
  let Team2DraftList =
    guild2 === 'Blacksmiths' ? BlacksmithDraftList : DraftList;

  return (
    <ImageBackground
      source={theme.image}
      style={{width: '100%', height: '100%', alignItems: 'center'}}
      imageStyle={{resizeMode: 'cover', opacity: 0.8}}>
      <SafeAreaView
        edges={
          landscape
            ? ['top', 'bottom', 'left', 'right']
            : ['bottom', 'left', 'right']
        }
        style={{
          width: '100%',
          height: '100%',
          flexDirection: landscape ? 'row' : 'column',
        }}>
        {/* {landscape && (
          <NavRail>
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
          </NavRail>
        )} */}

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: landscape ? 'row' : 'column',
          }}>
          <Team1DraftList
            guild={Guilds.find((g) => g.name === guild1)}
            ready={(team) => store.setRoster1(team)}
            unready={() => store.setRoster1([])}
            // style={{alignSelf: 'flex-end'}}
          />
        </View>

        <Observer>
          {() => (
            <FAB
              animated={false}
              onPress={() => props.navigation.navigate('Game')}
              disabled={!store.draftReady}
              icon={({size, color}) => (
                <GBIcons name="GBT" size={size} color={color} />
              )}
              style={{
                alignSelf: 'center',
                // backgroundColor: store.draftReady ? 'yellow' : '#ddd',
              }}
            />
          )}
        </Observer>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: landscape ? 'row' : 'column',
          }}>
          <Team2DraftList
            guild={Guilds.find((g) => g.name === guild2)}
            ready={(team) => store.setRoster2(team)}
            unready={() => store.setRoster2([])}
            // style={{alignSelf: 'flex-start'}}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
export default DraftScreen;

const draftStyles = StyleSheet.create({
  list: {
    padding: 10,
  },
  container: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  item: {
    flex: 1,
  },
});
