import React, {useRef} from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme, Chip, Text} from 'react-native-paper';
import {useDimensions} from '@react-native-community/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';

import {displayName} from '../components/GuildData';
import GBIcon from '../components/GBIcons';

import {useData} from '../components/DataContext';
import CardCarousel from '../components/CardCarousel';

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
      {/* background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <MaskedView
          style={{flex: 1}}
          maskElement={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                // backgroundColor: 'black',
              }}>
              <GBIcon name="GB" size={380} color="#fff" />
            </View>
          }>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LinearGradient
              colors={['#eee', '#888', '#222']}
              style={{
                width: '100%',
                height: 400,
              }}
            />
          </View>
        </MaskedView>
      </View>
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
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flex: -1,
            flexWrap: 'wrap',
            height: '100%',
            backgroundColor: props.theme.colors.surface,
          }}>
          {Guilds.map(g => (
            <Chip
              key={g.name}
              onPress={() => {
                props.navigation.navigate(g.name);
              }}>
              {g.name}
            </Chip>
            // <Drawer.Item
            //   style={{width: 110}}
            //   label={g.name}
            //   key={g.name}
            //   onPress={() => {
            //     props.navigation.navigate(g.name);
            //   }}
            // />
          ))}
        </View>
        <Text style={{position: 'absolute', bottom: 0, right: 0}}>
          [{version}]
        </Text>
      </View>
    </SafeAreaView>
  );
});

export default LibraryScreen;
