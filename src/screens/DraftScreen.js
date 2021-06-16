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

const DraftScreen = props => {
  const store = useStore();
  const theme = useTheme();

  const {data, version, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  const { guild1, guild2 } = props.route.params;

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
            flexDirection: landscape ? 'row' : 'column',
            height: '100%',
            width: '100%',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: landscape ? 'row' : 'column',
            }}>
            <Team1DraftList
              guild={Guilds.find(g => g.name === guild1)}
              ready={team => {
                store.setTeam1(guild1);
                store.setRoster1(team);
                store.team1.setScore(0);
                store.team1.setMomentum(0);
              }}
              unready={() => store.setRoster1([])}
            />
          </View>

          <Observer>
            {() => (
              <FAB
                theme={{colors: {accent: '#dda520'}}}
                animated={false}
                onPress={() => props.navigation.navigate('Game')}
                disabled={!store.draftReady}
                icon="play"
                // icon={({size, color}) => (
                // <GBIcons name="GBT" size={size} color={color} />
                // )}
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
              guild={Guilds.find(g => g.name === guild2)}
              ready={team => {
                store.setTeam2(guild2);
                store.setRoster2(team);
                store.team2.setScore(0);
                store.team2.setMomentum(0);
              }}
              unready={() => store.setRoster2([])}
            />
          </View>
          <Text style={{position: 'absolute', bottom: 0, right: 0}}>
            [{version}]
          </Text>
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
