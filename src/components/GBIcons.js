import React from 'react';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../assets/fonts/selection.json';
import icoPBConfig from '../assets/fonts/GBPlaybook.json';

// import {Guilds} from '../components/GuildData';
import MaskedView from '@react-native-community/masked-view';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';

import {useData} from '../components/DataContext';

const GBIcons = createIconSetFromIcoMoon(
  icoMoonConfig,
  'GuildBallIcon',
  'GuildBallIcon.ttf',
);

const PBIcons = createIconSetFromIcoMoon(
  icoPBConfig,
  'GBPlaybook',
  'GBPlaybook.ttf',
);

function PB(txt) {
  const i = txt.replace(',', '-').replace(/</g, 'D').replace(/>/g, 'P');
  return <PBIcons name={i} size={44} />;
}

export default GBIcons;
export {PBIcons, PB, GBIconGradient, GBIconFade};

function GBIconGradient(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  const guild = Guilds.find((g) => g.name === props.name);
  return (
    <MaskedView
      style={{flex: 1}}
      maskElement={
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <GBIcons name={guild.name} size={props.size} color="#fff" />
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
            width: props.size,
            height: props.size,
          }}
        />
      </View>
    </MaskedView>
  );
}

function GBIconFade(props) {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  const guild1 = Guilds.find((g) => g.name === props.guild1);
  const guild2 = Guilds.find((g) => g.name === props.guild2) ?? guild1;
  return (
    <View
      style={{
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: props.size * 2,
        // height: '100%',
        // height: props.size,
        // borderColor: 'blue', borderWidth: 1,
      }}>
      <MaskedView
        maskElement={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'black',
            }}>
            <GBIcons name={guild1.name} size={props.size} color="#fff" />
          </View>
        }>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LinearGradient
            start={{x: 0.4, y: 0}}
            end={{x: 0.6, y: 0}}
            colors={[guild1.color, guild1.color + '00']}
            style={{
              width: props.size * 2,
              height: props.size,
            }}
          />
        </View>
      </MaskedView>
      <MaskedView
        style={{
          position: 'absolute',
        }}
        maskElement={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <GBIcons name={guild2.name} size={props.size} color="#fff" />
          </View>
        }>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'blue',
            borderWidth: 1,
          }}>
          <LinearGradient
            start={{x: 0.6, y: 0}}
            end={{x: 0.4, y: 0}}
            colors={[guild2.color, guild2.color + '00']}
            style={{
              width: props.size * 2,
              height: props.size,
            }}
          />
        </View>
      </MaskedView>
    </View>
  );
}
