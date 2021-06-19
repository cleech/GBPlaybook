import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  withTheme,
  Title,
  Text,
  TextInput,
  RadioButton,
  Divider,
} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

import DropDown from 'react-native-paper-dropdown';
import {useStore} from '../stores/RootStore';
import {Observer} from 'mobx-react-lite';

import {useData} from '../components/DataContext';

const SettingsView = withTheme(props => {
  const theme = props.theme;
  const store = useStore();
  const settings = store.settings;
  const {manifest} = useData();

  const [showScreenDropDown, setScreenDropDown] = useState(false);
  const [showDataDropDown, setDataDropDown] = useState(false);

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <Observer>
        {() => (
          <ScrollView>
            <Title>{`GB Playbook ${DeviceInfo.getReadableVersion()}`}</Title>

            <Divider style={{marginVertical: 15}} />
            <View>
              <Title>Season and Errata Version:</Title>
              {store.draftReady ? (
                <Text>Season cannot be changed while a game is active.</Text>
              ) : (
                <></>
              )}
              <View style={{marginHorizontal: 10}}>
                <DropDown
                  value={settings.dataSet}
                  setValue={settings.setDataSet}
                  list={manifest.datafiles.map(dataSet => ({
                    label: `[${dataSet.version}] ${dataSet.description}`,
                    value: dataSet.filename,
                  }))}
                  mode="outlined"
                  visible={showDataDropDown}
                  showDropDown={() => {
                    if (!store.draftReady) {
                      setDataDropDown(true);
                    }
                  }}
                  onDismiss={() => setDataDropDown(false)}
                  inputProps={{
                    right: <TextInput.Icon name="menu-down" />,
                    editable: false,
                  }}
                />
              </View>
            </View>

            <Divider style={{marginVertical: 15}} />
            <View>
              <Title>Inital Screen:</Title>
              <View style={{marginHorizontal: 10}}>
                <DropDown
                  value={settings.initialScreen}
                  setValue={settings.setInitialScreen}
                  list={[
                    {label: 'Game Play', value: 'Game Play'},
                    {label: 'Card Library', value: 'Library'},
                  ]}
                  mode="outlined"
                  visible={showScreenDropDown}
                  showDropDown={() => setScreenDropDown(true)}
                  onDismiss={() => setScreenDropDown(false)}
                  inputProps={{
                    right: (
                      <TextInput.Icon name="menu-down" numberOfLines={1} />
                    ),
                    editable: false,
                  }}
                />
              </View>
            </View>

            <Divider style={{marginVertical: 15}} />
            <View>
              <Title>App Theme:</Title>
              <RadioButton.Group
                value={settings.colorScheme}
                onValueChange={newValue => settings.setColorScheme(newValue)}>
                <RadioButton.Item
                  color={theme.colors.primary}
                  label="Light "
                  value="light"
                />
                <RadioButton.Item
                  color={theme.colors.primary}
                  label="Dark"
                  value="dark"
                />
              </RadioButton.Group>
            </View>
          </ScrollView>
        )}
      </Observer>
    </SafeAreaView>
  );
});

export default SettingsView;
