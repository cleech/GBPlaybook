import React, {useRef} from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme, Chip, Text} from 'react-native-paper';
import {useDimensions} from '@react-native-community/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';

import {displayName} from '../components/GuildData';

import {useData} from '../components/DataContext';
import CardCarousel from '../components/CardCarousel';

import GuildGrid, {itemSize} from '../components/GuildGrid';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';

const TeamLibrary = withTheme(props => {
  const gdata = useData();
  if (gdata.loading) {
    return null;
  }
  const Guilds = gdata.data.Guilds;
  const Models = gdata.data.Models;
  const version = gdata.version;

  const {height, width} = useDimensions().window;
  const landscape = width > height;

  const guild = Guilds.find(m => m.name === props.route.name);
  const data = [
    {model: {id: guild.name}, overlay: false},
    ...guild.roster.map(name => ({
      model: Models.find(m => m.id === name),
      overlay: true,
    })),
  ];

  var carousel = useRef(null);

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: landscape ? 'row-reverse' : 'column',
      }}>
      <View style={{flex: 1, width: '100%', height: '100%'}}>
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
  const {height, width} = useDimensions().window;
  const landscape = width > height;

  const {data, version, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  return (
    <ImageBackground
      source={require('../assets/library.jpg')}
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
          flexDirection: 'row',
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
