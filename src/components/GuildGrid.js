import React from 'react';
import {View} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';
import GBIcon from '../components/GBIcons';
// import Guilds from '../components/GuildData';
import {Text, withTheme} from 'react-native-paper';

import {useHeaderHeight} from '@react-navigation/stack';
import {DEFAULT_RAIL_WIDTH} from '../components/NavRail';

export const itemSize = (screen) => {
  const header = useHeaderHeight();
  const width = screen.window.width - DEFAULT_RAIL_WIDTH;
  const height = screen.window.height - header;

  // const layout = (w, h) =>
  //   Math.min(Math.floor(width / w) - 10, Math.floor(height / (h + 1)) - 10);

  const layout = (w, h) =>
    Math.min(
      Math.floor((width - (w + 1) * 10) / w),
      Math.floor((height - (h + 2) * 10) / (h + 1)),
    );

  return Math.max(layout(6, 3), layout(5, 4), layout(4, 5), layout(3, 6));
};

import Color from 'color';

import {useData} from '../components/DataContext';

const GuildGrid = withTheme((props) => {
  let screenData = useDimensions();
  let itemsize = itemSize(screenData);

  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}>
      {Guilds.map((item) => (
        <View
          style={{
            marginVertical: 5,
            width: itemsize,
            height: itemsize,
            backgroundColor: '#fff4',
            borderRadius: 24,
            alignItems: 'center',
          }}
          key={item.name}>
          <View
            style={{
              marginVertical: 5,
              alignItems: 'center',
            }}>
            <GBIcon
              name={item.name}
              size={itemsize - 32}
              style={{
                flex: 1,
                color:
                  props.theme.dark && item.darkColor
                    ? item.darkColor
                    : item.color,
                width: '100%',
                textAlign: 'center',
                textShadowColor: item.shadow
                  ? item.shadow
                  : props.theme.dark
                  ? '#000'
                  : '#fff',
                textShadowOffset: {width: 0, height: 0},
                textShadowRadius: 15,
                ////////////////
                // borderColor: 'blue',
                // borderWidth: 1,
              }}
              onPress={() => props.pickTeam(item.name)}
            />
            <GBIcon
              name="blank"
              size={itemsize - 32}
              // size={itemsize}
              style={{
                position: 'absolute',
                zIndex: -1,
                color: props.theme.dark ? '#000' : '#fff',
                textAlign: 'center',
                width: '100%',
                textShadowColor: props.theme.dark ? '#000' : '#fff',
                textShadowOffset: {width: 0, height: 0},
                textShadowRadius: 15,
              }}
            />
            <Text
              // allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              {item.name}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
});

export default GuildGrid;
