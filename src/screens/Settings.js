import React, {useState} from 'react';
import {View} from 'react-native';
import {withTheme, Title, RadioButton, Divider} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

import {Picker} from '@react-native-picker/picker';
import {useStore} from '../stores/RootStore';
import {Observer} from 'mobx-react-lite';

import {useData} from '../components/DataContext';

const SettingsView = withTheme(props => {
  const settings = useStore().settings;
  const {manifest} = useData();

  return (
    <Observer>
      {() => (
        <View>
          <Title>{`GB Playbook ${DeviceInfo.getReadableVersion()}`}</Title>

          <Divider />

          <View>
            <Title>Season and Errata Version:</Title>
            <Picker
              mode="dropdown"
              selectedValue={settings.dataSet}
              onValueChange={(itemValue, itemIndex) => {
                settings.setDataSet(itemValue);
              }}>
              {manifest.datafiles.map(dataSet => (
                <Picker.Item
                  key={dataSet.version}
                  style={{
                    color: props.theme.colors.text,
                    backgroundColor: props.theme.colors.background,
                  }}
                  label={`[${dataSet.version}] ${dataSet.description}`}
                  value={dataSet.filename}
                />
              ))}
            </Picker>
          </View>

          <Divider />

          <View>
            <Title>App Theme:</Title>
            <RadioButton.Group
              value={settings.colorScheme}
              onValueChange={newValue => settings.setColorScheme(newValue)}>
              <RadioButton.Item label="Light Theme" value="light" />
              <RadioButton.Item label="Dark Theme" value="dark" />
            </RadioButton.Group>
          </View>

          <Divider />

          <View>
            <Title>Inital Screen:</Title>
            <Picker
              mode="dropdown"
              selectedValue={settings.initialScreen}
              onValueChange={(itemValue, itemIndex) => {
                settings.setInitialScreen(itemValue);
              }}>
              <Picker.Item
                style={{
                  color: props.theme.colors.text,
                  backgroundColor: props.theme.colors.background,
                }}
                label="Game Play"
                value="Game Play"
              />
              <Picker.Item
                style={{
                  color: props.theme.colors.text,
                  backgroundColor: props.theme.colors.background,
                }}
                label="Card Library"
                value="Library"
              />
            </Picker>
          </View>

        </View>
      )}
    </Observer>
  );
});

export default SettingsView;
