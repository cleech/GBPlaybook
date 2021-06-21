import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, FAB} from 'react-native-paper';
import {useDimensions} from '@react-native-community/hooks';

import {useStore} from '../stores/RootStore';
import {useData} from '../components/DataContext';
import {DraftList, BlacksmithDraftList} from '../components/DraftList';

const DraftScreen = props => {
  const store = useStore();
  const theme = useTheme();

  const {height, width} = useDimensions().window;
  const landscape = width > height;

  const [team1, setTeam1] = useState(undefined);
  const [team2, setTeam2] = useState(undefined);

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
      style={{width: '100%', height: '100%', alignItems: 'center'}}
      imageStyle={{resizeMode: 'cover', opacity: 0.8}}>
      <SafeAreaView
        edges={
          landscape
            ? ['top', 'bottom', 'left', 'right']
            : ['bottom', 'left', 'right']
        }
        style={{
          width: '100%',
          height: '100%',
          flexDirection: landscape ? 'row' : 'column',
        }}>
        <View
          style={{
            flexDirection: landscape ? 'row' : 'column',
            height: '100%',
            width: '100%',
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
            // icon={({size, color}) => (
            // <GBIcons name="GBT" size={size} color={color} />
            // )}
            style={{
              alignSelf: 'center',
              // backgroundColor: store.draftReady ? 'yellow' : '#ddd',
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
        </View>
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
