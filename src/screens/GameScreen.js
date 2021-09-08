import React, {useState, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  useSafeAreaFrame,
} from 'react-native-safe-area-context';
import {Snackbar} from 'react-native-paper';

import {useStore} from '../stores/RootStore';
import RosterList from '../components/RosterList';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {changeBarColors} from 'react-native-immersive-bars';

function PortraitView(props) {
  const store = useStore();

  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom', 'left', 'right']}>
      <RosterList teams={[store.team1, store.team2]} />
    </SafeAreaView>
  );
}

function LandscapeView(props) {
  const store = useStore();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <RosterList teams={[store.team1]} />
        <RosterList teams={[store.team2]} />
      </View>
    </SafeAreaView>
  );
}

export default function GameScreen(props) {
  const store = useStore();
  const {height, width} = useSafeAreaFrame();
  const landscape = width > height;

  const [showSnack, setShowSnack] = useState(false);
  const [navEvent, saveNavEvent] = useState(null);

  const theme = useTheme();

  useEffect(() =>
    props.navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      saveNavEvent(e);
      setShowSnack(true);
    }),
  );

  useFocusEffect(
    useCallback(() => {
      changeBarColors(theme.dark);
    }),
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, width: '100%'}}>
      {landscape ? <LandscapeView {...props} /> : <PortraitView {...props} />}
      <Snackbar
        visible={showSnack}
        onDismiss={() => setShowSnack(false)}
        action={{
          label: 'Exit Game',
          onPress: () => {
            props.navigation.dispatch(navEvent.data.action);
            store.team1.reset({});
            store.team1.reset({});
          },
        }}
        wrapperStyle={{marginBottom: insets.bottom}}>
        Leaving this screen will reset the game state
      </Snackbar>
    </View>
  );
}
