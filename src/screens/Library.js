import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme, Drawer, Chip, Appbar, Text} from 'react-native-paper';
import {useDimensions} from '@react-native-community/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
// import { View as SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// import Guilds, {Models, displayName} from '../components/GuildData';
import {displayName} from '../components/GuildData';
import GBIcon from '../components/GBIcons';
import BoopCardView from '../components/BoopCard';
import DoubleCardView from '../components/DoubleCard';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import Color from 'color';

import Carousel from 'react-native-snap-carousel';
import {GBIconGradient} from '../components/GBIcons';
// import NavRail from '../components/NavRail';
import {CommonActions} from '@react-navigation/native';

import {useData} from '../components/DataContext';

function TeamLibrary(props) {
  return <TeamLibraryPhone {...props} />;
  if (DeviceInfo.isTablet()) {
    return <TeamLibraryTablet {...props} />;
  } else {
    return <TeamLibraryPhone {...props} />;
  }
}

const TeamLibraryPhone = withTheme(props => {
  const gdata = useData();
  if (gdata.loading) {
    return null;
  }
  const Guilds = gdata.data.Guilds;
  const Models = gdata.data.Models;
  const version = gdata.version;

  const {height, width} = useDimensions().window;
  const landscape = width > height;

  const [vheight, setHeight] = useState(0);
  const [vwidth, setWidth] = useState(0);

  const guild = Guilds.find(m => m.name === props.route.name);
  const data = [
    {model: {id: guild.name}, overlay: false},
    ...guild.roster.map(name => ({
      model: Models.find(m => m.id === name),
      overlay: true,
    })),
  ];

  var carousel = useRef(null);

  const cardWidth = Math.min(
    // try and leave some margin
    vwidth * 0.8,
    // height constrained
    Math.min(700, vheight) * (landscape ? 10 / 7 : 5 / 7),
    // width constrained
    Math.min(landscape ? 1000 : 500, vwidth),
  );
  const cardHeight = (cardWidth * 7) / (landscape ? 10 : 5);

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: landscape ? 'row-reverse' : 'column',
      }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        onLayout={event => {
          setHeight(event.nativeEvent.layout.height);
          setWidth(event.nativeEvent.layout.width);
        }}>
        {/* <View
          style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}>
          <GBIconGradient name={guild.name} size={380} />
        </View> */}

        {!!vwidth && (
          <Carousel
            ref={c => {
              carousel = c;
            }}
            contentContainerCustomStyle={{
              alignItems: 'center',
            }}
            data={data}
            itemWidth={cardWidth}
            sliderWidth={vwidth}
            initialScrollIndex={0}
            lockScrollWhileSnapping={true}
            useScrollView={true}
            // initialNumToRender={3}
            // windowSize={3}
            // maxToRenderPerBatch={2}
            removeClippedSubviews={false}
            renderItem={({index, item}) => (
              <View
                key={index}
                style={{
                  flex: -1,
                  width: '100%',
                  maxWidth: landscape ? 1000 : 500,
                  maxHeight: 700,
                  aspectRatio: landscape ? 10 / 7 : 5 / 7,
                }}>
                {landscape ? (
                  <DoubleCardView {...item} />
                ) : (
                  <BoopCardView {...item} />
                )}
              </View>
            )}
          />
        )}
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
          // padding: 5,
          // borderColor: 'blue',
          // borderWidth: 1,
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
    </SafeAreaView>
  );
});

const TeamLibraryTablet = withTheme(props => {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;
  const Models = data.Models;

  const guild = Guilds.find(m => m.name === props.route.name);
  const [model, setModel] = useState(null);
  const {height, width} = useDimensions().window;
  const landscape = width > height;

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
              <GBIcon name={guild.name} size={380} color="#fff" />
            </View>
          }>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LinearGradient
              colors={[
                guild.color,
                guild.darkColor ?? Color(guild.color).lightness(85).string(),
                guild.color,
                guild.shadow ?? Color(guild.color).lightness(10).string(),
              ]}
              locations={[0.1, 0.3, 0.6, 1]}
              style={{
                width: '100%',
                height: 400,
              }}
            />
          </View>
        </MaskedView>
      </View>

      {/* sidebar */}
      <View
        style={{
          flex: -1,
          flexWrap: 'wrap',
          // width: 320, // 280 max on phone, smaller side - appbar height (56)?
          height: '100%',
          backgroundColor: props.theme.colors.surface,
        }}>
        {Models.filter(m => guild.roster.includes(m.id)).map(m => (
          <Drawer.Item label={m.name} key={m.id} onPress={() => setModel(m)} />
        ))}
      </View>

      {/* card area */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          //////////
          // borderColor: 'blue',
          // borderWidth: 1,
        }}>
        <View
          style={{
            flex: -1,
            alignSelf: 'center',
            width: '100%',
            maxHeight: 700,
            // maxWidth: landscape ? 1000 : 500,
            aspectRatio: (landscape ? 10 : 5) / 7,
            //////////
            // borderColor: 'red',
            // borderWidth: 1,
          }}>
          {!landscape && model && <BoopCardView model={model} />}
          {landscape && model && <DoubleCardView model={model} />}
        </View>
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
