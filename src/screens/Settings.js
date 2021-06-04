import React, {useState} from 'react';
import {View} from 'react-native';
import {withTheme, Title, RadioButton, Divider} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
// import NavRail from '../components/NavRail';

import {Picker} from '@react-native-picker/picker';
import {useStore} from '../stores/RootStore';
import {Observer} from 'mobx-react-lite';

import {useData} from '../components/DataContext';

const SettingsView = withTheme(props => {
  // const [dataSet, setDataSet] = useState(null);
  const settings = useStore().settings;
  const {manifest} = useData();

  return (
    <Observer>
      {() => (
        <View>
          <Title>{`GB Playbook ${DeviceInfo.getReadableVersion()}`}</Title>
          <Divider />
          <Title>Season and Errata Version:</Title>
          <Picker
            mode="dropdown"
            selectedValue={settings.dataSet}
            onValueChange={(itemValue, itemIndex) => {
              // console.log(itemValue);
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
          <Divider />
          <Title>App Theme:</Title>
          <RadioButton.Group
            value={settings.colorScheme}
            onValueChange={newValue => settings.setColorScheme(newValue)}>
            <RadioButton.Item label="Light Theme" value="light" />
            <RadioButton.Item label="Dark Theme" value="dark" />
          </RadioButton.Group>
        </View>
      )}
    </Observer>
  );
});

export default SettingsView;
