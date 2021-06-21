import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Snackbar} from 'react-native-paper';

import {useStore} from '../stores/RootStore';
import RosterList from '../components/RosterList';

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
  const {height, width} = useDimensions().window;
  const landscape = width > height;

  const [showSnack, setShowSnack] = useState(false);
  const [navEvent, saveNavEvent] = useState(null);

  useEffect(() =>
    props.navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      saveNavEvent(e);
      setShowSnack(true);
    }),
  );

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
        }}>
        Leaving this screen will reset the game state
      </Snackbar>
    </View>
  );
}
