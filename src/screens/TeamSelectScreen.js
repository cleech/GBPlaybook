import React, {useState} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Text, withTheme, FAB} from 'react-native-paper';

import {
  useDimensions,
  useDeviceOrientation,
} from '@react-native-community/hooks';

import {useTheme} from '@react-navigation/native';

import GBIcon from '../components/GBIcons';
import GuildGrid, {itemSize} from '../components/GuildGrid';

import {types} from 'mobx-state-tree';
import {observer, Observer} from 'mobx-react-lite';
import {useStore} from '../stores/RootStore';
// import NavRail from '../components/NavRail';
import {Appbar} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';

import {StatusBar} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useData} from '../components/DataContext';

const TeamScreenStore = types
  .model({
    selector: types.enumeration(['P1', 'P2', 'GO']),
  })
  .actions(self => ({
    setSelector(s) {
      self.selector = s;
    },
  }));

const screenStore = TeamScreenStore.create({
  selector: 'P1',
});

const TeamSelectScreen = withTheme(props => {
  const store = useStore();
  const theme = useTheme();
  const {version} = useData();

  // const orientation = useDeviceOrientation();
  const dimensions = useDimensions();
  const itemsize = itemSize(dimensions);
  const {height, width} = dimensions.window;
  const landscape = width > height;

  function pickTeam(name) {
    if (screenStore.selector === 'P1') {
      store.setTeam1(name);
      if (!store.team2.name) {
        screenStore.setSelector('P2');
      } else {
        screenStore.setSelector('GO');
      }
    } else if (screenStore.selector === 'P2') {
      store.setTeam2(name);
      if (!store.team1.name) {
        screenStore.setSelector('P1');
      } else {
        screenStore.setSelector('GO');
      }
    }
  }

  return (
    <ImageBackground
      source={theme.image}
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
      imageStyle={{resizeMode: 'cover'}}
      // imageStyle={{resizeMode: 'cover', opacity: 0.8}}
    >
      {/* <StatusBar translucent={true} backgroundColor="transparent" /> */}
      <SafeAreaView
        edges={
          landscape
            ? ['top', 'bottom', 'left', 'right']
            : ['bottom', 'left', 'right']
        }
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
        }}>
        {/* {landscape && (
          <NavRail>
            <Appbar.Action />
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
        <View style={{flex: 1, alignItems: 'center'}}>
          <GuildGrid pickTeam={pickTeam} />
          <View flex={1} />
          <Observer>
            {() => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <SelectorIcon id="P1" team={store.team1} />

                <View
                  style={{
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      // fontFamily: 'IMFellGreatPrimerSC-Regular',
                      fontSize: 24,
                    }}>
                    vs
                  </Text>
                  <FAB
                    theme={{colors: { accent: '#daa520'}}}
                    animated={false}
                    disabled={screenStore.selector !== 'GO'}
                    icon='play'
                    // icon={({size, color}) => (
                      // <GBIcon name="GBT" size={size} color={color} />
                    // )}
                    onPress={() => {
                      if (screenStore.selector === 'GO') {
                        props.navigation.navigate('Draft');
                      } else if (
                        store.team1.name != '' &&
                        store.team2.name != ''
                      ) {
                        screenStore.setSelector('GO');
                      }
                    }}
                  />
                </View>

                <SelectorIcon id="P2" team={store.team2} />
              </View>
            )}
          </Observer>
          <Text style={{position: 'absolute', bottom: 0, right: 0}}>
            [{version}]
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
});

export default TeamSelectScreen;

const SelectorIcon = withTheme(
  observer(props => {
    const dimensions = useDimensions();
    const itemsize = itemSize(dimensions);
    return (
      <TouchableOpacity onPress={() => screenStore.setSelector(props.id)}>
        <View
          style={{
            backgroundColor: '#fff4',
            borderRadius: 24,
            borderWidth: 4,
            borderColor: screenStore.selector === props.id ? 'yellow' : '#fff5',
            alignItems: 'center',
            justifyContent: 'center',
            height: itemsize,
            width: itemsize,
            margin: 0,
            overflow: 'hidden',
          }}>
          <Text style={{fontSize: itemsize / 2}}>{props.id}</Text>
          {!props.team.name ? (
            <></>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: itemsize * 2,
                position: 'absolute',
                zIndex: -1,
              }}>
              <GBIcon
                name={props.team.name}
                size={itemsize}
                style={{
                  color: props.theme.dark ? '#000a' : '#fff6',
                }}
              />
            </View>
          )}
          <Text>{props.team.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
