import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ImageBackground, ScrollView} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import {SafeAreaView, useSafeAreaFrame} from 'react-native-safe-area-context';
import {Text, FAB} from 'react-native-paper';

import {useStore} from '../stores/RootStore';
import {useData} from '../components/DataContext';
import {DraftList, BlacksmithDraftList} from '../components/DraftList';

import {changeBarColors} from 'react-native-immersive-bars';

const DraftScreen = props => {
  const store = useStore();
  const theme = useTheme();

  const headerHeight = useHeaderHeight();
  const {height, width} = useSafeAreaFrame();
  const landscape = width > height;

  const [team1, setTeam1] = useState(undefined);
  const [team2, setTeam2] = useState(undefined);

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

  const {guild1, guild2} = props.route.params;

  let Team1DraftList =
    guild1 === 'Blacksmiths' ? BlacksmithDraftList : DraftList;
  let Team2DraftList =
    guild2 === 'Blacksmiths' ? BlacksmithDraftList : DraftList;

  return (
    <ImageBackground
      source={theme.image}
      style={{
        width: '100%',
        height: '100%',
      }}
      imageStyle={{resizeMode: 'cover'}}>
      <SafeAreaView
        edges={
          landscape
            ? ['top', 'bottom', 'left', 'right']
            : ['bottom', 'left', 'right']
        }
        style={{
          width: '100%',
          height: '100%',
          paddingTop: headerHeight,
        }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            // horizontal: landscape,
            flexDirection: landscape ? 'row' : 'column',
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
                setTeam1(team);
              }}
              unready={() => {
                setTeam1(undefined);
              }}
            />
          </View>

          <FAB
            theme={{colors: {accent: '#dda520'}}}
            animated={false}
            onPress={() => {
              store.team1.reset({name: guild1, roster: team1});
              store.team2.reset({name: guild2, roster: team2});
              props.navigation.navigate('Game');
            }}
            disabled={!(team1 && team2)}
            icon="play"
            style={{
              alignSelf: 'center',
            }}
          />

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
                setTeam2(team);
              }}
              unready={() => {
                setTeam2(undefined);
              }}
            />
          </View>

          <Text style={{position: 'absolute', bottom: 0, right: 0}}>
            [{version}]
          </Text>
        </ScrollView>
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
