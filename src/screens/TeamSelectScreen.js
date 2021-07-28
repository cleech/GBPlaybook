import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import {SafeAreaView, useSafeAreaInsets, useSafeAreaFrame} from 'react-native-safe-area-context';
import {Text, withTheme, FAB, Snackbar} from 'react-native-paper';
import {changeBarColors} from 'react-native-immersive-bars';
import Color from 'color';

import {useStore} from '../stores/RootStore';
import GBIcon from '../components/GBIcons';
import GuildGrid, {itemSize as gItemSize} from '../components/GuildGrid';
import {useData} from '../components/DataContext';

const TeamSelectScreen = withTheme(props => {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const theme = useTheme();
  const {version} = useData();

  const [selector, setSelector] = useState('P1');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const [itemSize, setItemSize] = useState(0);

  useFocusEffect(
    useCallback(() => {
      changeBarColors(true);
    }),
  );

  const dimensions = useSafeAreaFrame();
  const {height, width} = dimensions;
  const landscape = width > height;

  function pickTeam(name) {
    if (selector === 'P1') {
      setTeam1(name);
      if (!team2) {
        setSelector('P2');
      } else {
        setSelector('GO');
      }
    } else if (selector === 'P2') {
      setTeam2(name);
      if (!team1) {
        setSelector('P1');
      } else {
        setSelector('GO');
      }
    }
  }

  const [showResume, setResume] = useState(store.draftReady);
  const headerHeight = useHeaderHeight();

  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Guilds = data.Guilds;

  return (
    <ImageBackground
      source={theme.image}
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
      imageStyle={{resizeMode: 'cover'}}>
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
          paddingTop: headerHeight,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            // borderColor: 'blue', borderWidth: 1,
          }}
          onLayout={event => {
            const itm = gItemSize(event.nativeEvent.layout, Guilds.length, 1);
            setItemSize(itm.size);
          }}>
          <GuildGrid
            pickTeam={pickTeam}
            // size={itemSize}
            // sizeCallback={size => setItemSize(size)}
          />

          <View
            style={{
              flex: -1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <SelectorIcon
              id="P1"
              team={team1}
              itemSize={itemSize}
              selector={selector}
              setSelector={setSelector}
            />

            <View
              style={{
                alignItems: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  // fontFamily: 'IMFellGreatPrimerSC-Regular',
                  fontSize: 24,
                }}>
                vs
              </Text>
              <FAB
                theme={{colors: {accent: '#daa520'}}}
                animated={false}
                disabled={!team1 || !team2}
                icon="play"
                onPress={() => {
                  props.navigation.navigate('Draft', {
                    guild1: team1,
                    guild2: team2,
                  });
                }}
              />
            </View>

            <SelectorIcon
              id="P2"
              team={team2}
              itemSize={itemSize}
              selector={selector}
              setSelector={setSelector}
            />
          </View>

          <Text style={{position: 'absolute', bottom: 0, right: 0}}>
            [{version}]
          </Text>
        </View>

        <Snackbar
          visible={showResume}
          onDismiss={() => setResume(false)}
          action={{
            label: 'Resume',
            onPress: () => {
              props.navigation.navigate('Game');
            },
          }}
          wrapperStyle={{marginBottom: insets.bottom}}>
          Game In Progress
        </Snackbar>
      </SafeAreaView>
    </ImageBackground>
  );
});

export default TeamSelectScreen;

const SelectorIcon = withTheme(props => {
  const itemsize = props.itemSize;
  const {loading, data} = useData();
  if (loading || !itemsize) {
    return <></>;
  }
  const guild = data.Guilds.find(g => g.name === props.team);
  return (
    <TouchableOpacity onPress={() => props.setSelector(props.id)}>
      <View
        style={{
          // backgroundColor: '#fff4',
          backgroundColor: guild
            ? Color(
                guild.shadow ??
                  (props.theme.dark
                    ? guild.darkColor ?? guild.color
                    : guild.color),
              )
                .alpha(0.7)
                .string()
            : '#fff4',
          borderRadius: itemsize * 0.15,
          borderWidth: 4,
          borderColor: props.selector === props.id ? 'yellow' : '#fff5',
          alignItems: 'center',
          justifyContent: 'center',
          height: itemsize,
          width: itemsize,
          margin: 0,
          overflow: 'hidden',
          margin: 5,
        }}>
        {!props.team ? (
          <Text style={{fontSize: itemsize / 2}} allowFontScaling={false}>
            {props.id}
          </Text>
        ) : (
          <>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: itemsize * 2,
                position: 'absolute',
                zIndex: -1,
              }}>
              <GBIcon
                name={guild.name}
                size={itemsize}
                style={{
                  color: props.theme.dark ? '#000a' : '#fff6',
                }}
              />
            </View>
            <Text
              // allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                color: 'white',
                // color: Color(guild.color).isDark() ? 'white' : 'black',
                // textShadowColor: Color(guild.color).isDark() ? 'black' : 'white',
                textShadowColor: 'black',
                textShadowRadius: 5,
              }}>
              {props.team}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
