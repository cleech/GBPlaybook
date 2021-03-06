import React, {useRef, useCallback} from 'react';
import {View} from 'react-native';
import {withTheme, Chip, Text} from 'react-native-paper';
import {SafeAreaView, useSafeAreaFrame} from 'react-native-safe-area-context';

import {displayName} from '../components/GuildData';

import {useData} from '../components/DataContext';
import CardCarousel from '../components/CardCarousel';

import GuildGrid from '../components/GuildGrid';
import {ImageBackground} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';

import {changeBarColors} from 'react-native-immersive-bars';
import {useFocusEffect} from '@react-navigation/native';

const TeamLibrary = withTheme(props => {
  const theme = props.theme;
  const {height, width} = useSafeAreaFrame();
  const landscape = width > height;

  var carousel = useRef(null);

  useFocusEffect(
    useCallback(() => {
      changeBarColors(theme.dark);
    }),
  );

  const gdata = useData();
  if (gdata.loading) {
    return null;
  }
  const Guilds = gdata.data.Guilds;
  const Models = gdata.data.Models;
  const version = gdata.version;

  const guild = Guilds.find(m => m.name === props.route.name);
  const data = [
    {model: {id: guild.name}, overlay: false},
    ...guild.roster.map(name => ({
      model: Models.find(m => m.id === name),
      overlay: true,
    })),
  ];

  return (
    <SafeAreaView
      edges={
        landscape
          ? ['top', 'bottom', 'left', 'right']
          : ['bottom', 'left', 'right']
      }
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: landscape ? 'row-reverse' : 'column',
      }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
        <CardCarousel
          ref={c => (carousel = c)}
          data={data}
          landscape={landscape}
        />
        <Text style={{position: 'absolute', bottom: 0, right: 0}}>
          [{version}]
        </Text>
      </View>
      <View
        style={{
          flex: -1,
          justifyContent: 'center',
          flexDirection: landscape ? 'column' : 'row',
          // flexWrap: landscape ? 'nowrap' : 'wrap',
          flexWrap: 'wrap',
        }}>
        {data.map(
          (m, idx) =>
            m.model.name && (
              <Chip
                key={m.model.id}
                mode="outlined"
                style={{
                  flexDirection: landscape ? 'row' : 'column',
                  margin: 1,
                }}
                onPress={() => {
                  carousel.snapToItem(idx, true, false);
                }}>
                {displayName(m.model)}
              </Chip>
            ),
        )}
      </View>
    </SafeAreaView>
  );
});

export {TeamLibrary};

const LibraryScreen = withTheme(props => {
  const {height, width} = useSafeAreaFrame();
  const landscape = width > height;

  const headerHeight = useHeaderHeight();

  useFocusEffect(
    useCallback(() => {
      changeBarColors(true);
    }),
  );

  const {data, version, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  return (
    <ImageBackground
      source={props.theme.image}
      style={{width: '100%', height: '100%', alignItems: 'center'}}
      imageStyle={{resizeMode: 'cover'}}>
      <SafeAreaView
        edges={
          landscape
            ? ['top', 'bottom', 'left', 'right']
            : ['bottom', 'left', 'right']
        }
        style={{
          flex: 1,
          marginTop: headerHeight,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: '100%',
          }}>
          <GuildGrid
            pickTeam={guild => {
              props.navigation.navigate(guild);
            }}
          />
          <Text style={{position: 'absolute', bottom: 0, right: 0}}>
            [{version}]
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
});

export default LibraryScreen;
