import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import GBIcon from '../components/GBIcons';
import {Text, withTheme} from 'react-native-paper';

import _ from 'lodash';

export const itemSize = ({width, height}, count, extra = 0) => {
  if (!width || !height) {
    return undefined;
  }

  const layout = (w, h) => {
    // the 10 here it 2 * margin, or minimal spacing to use
    const iw = Math.floor((width - w * 10) / w);
    const ih = Math.floor((height - h * 10) / h);
    const size = Math.min(iw, ih);
    const margin = (iw - size) / 2;
    return {
      w: iw,
      h: ih,
      size: size,
      margin: margin,
      wx: w,
      hx: h,
    };
  };

  return _.maxBy(
    // no more guessing, just check every possible layout
    _.range(1, count + 1).map(n => layout(n, Math.ceil(count / n) + extra)),
    layout => layout.size,
  );
};

import Color from 'color';

import {useData} from '../components/DataContext';

const GuildGrid = withTheme(props => {
  const [itm, setITM] = useState(undefined);
  const itemsize = props.size ?? (itm ? itm.size : undefined);

  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  return (
    <View
      style={{
        width: '100%',
        // height: '100%',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      }}
      onLayout={event => {
        const itm = itemSize(event.nativeEvent.layout, Guilds.length);
        setITM(itm);
        if (itm && props.sizeCallback) {
          props.sizeCallback(itm.size);
        }
      }}>
      {itemsize &&
        Guilds.map(item => (
          <TouchableOpacity
            style={{
              margin: 5,
              width: itemsize,
              height: itemsize,
              // aspectRatio: 1,
              // backgroundColor: '#fff4',
              backgroundColor: Color(props.theme.colors.surface)
                .alpha(props.theme.dark ? 0.6 : 0.25)
                .string(),
              borderRadius: itemsize * 0.15,
              alignItems: 'center',
            }}
            onPress={() => props.pickTeam(item.name)}
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
                style={{
                  textShadowColor: props.theme.dark ? 'black' : 'white',
                  textShadowRadius: 5,
                }}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
});

export default GuildGrid;
