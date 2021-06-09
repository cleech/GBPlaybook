import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import AwesomeIcons from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
// import {Models, displayName, keyName} from '../components/GuildData';
import {displayName, keyName} from '../components/GuildData';
import color from 'color';

function checkSingleton(roster, model, value, condition) {
  if (condition(model)) {
    roster.forEach((m) => {
      if (condition(m) && m !== model) {
        m.disabled += value ? 1 : -1;
      }
    });
    return value;
  }
}

// returns true/false when captain is set/unset
// returned undefined on other switch events
function checkCaptains(roster, model, value) {
  return checkSingleton(...arguments, (m) => m.captain);
}

// returns true/false when mascot is set/unset
// returned undefined on other switch events
function checkMascots(roster, model, value) {
  return checkSingleton(...arguments, (m) => m.mascot);
}

function checkVeterans(roster, model, value) {
  roster.forEach((m) => {
    if (m !== model && m.name === model.name) {
      m.disabled += value ? 1 : -1;
    }
    // special handling of vGreede / Averisse
    // for veteran of previously benched model
    if (m.dehcneb === model.name || m.name === model.dehcneb) {
      m.disabled += value ? 1 : -1;
    }
  });
}

function checkBenched(roster, model, value) {
  if (model.dehcneb) {
    let b = roster.find((b) => b.benched && b.name === model.dehcneb);
    b.selected = value;
  }
}

// enforce a limit of how many models can be selected that match a given condition
function checkCount(roster, model, oldCount, value, condition, limit) {
  var newCount = oldCount;
  if (condition(model)) {
    newCount += value ? 1 : -1;
    if (newCount === limit) {
      roster.forEach((m) => {
        if (!m.selected && condition(m)) {
          m.disabled += 1;
        }
      });
    } else if (newCount === limit - 1 && oldCount === limit) {
      roster.forEach((m) => {
        if (!(m === model || m.selected) && condition(m)) {
          m.disabled += -1;
        }
      });
    }
  }
  return newCount;
}

// 4 squaddies
function checkSquaddieCount(roster, model, count, value) {
  return checkCount(...arguments, (m) => !(m.captain || m.mascot), 4);
}

// 3 masters
function checkMasterCount(roster, model, count, value) {
  return checkCount(...arguments, (m) => m.captain, 3);
}

// 3 apprentices
function checkApprenticeCount(roster, model, count, value) {
  return checkCount(...arguments, (m) => !m.captain, 3);
}

const DraftListItem = withTheme((props) => {
  const model = props.model;
  const colors = props.theme.colors;
  return (
    <TouchableOpacity
      borderless
      onPress={props.onPress}
      disabled={model.disabled > 0}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: 4,
        }}>
        <AwesomeIcons
          name={model.selected ? 'dot-circle-o' : 'circle-o'}
          size={18}
          color={
            model.disabled
              ? colors.disabled
              : color(colors.text).alpha(0.54).string()
          }
          style={{padding: 4}}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: -1,
            // width: '100%',
            minHeight: 24,
            lineHeight: 24,
            textAlignVertical: 'center',
            color: model.disabled
              ? colors.disabled
              : color(colors.text).alpha(0.87).string(),
            marginVertical: 4,
            marginRight: 8,
            marginLeft: 4,
          }}>
          {displayName(model)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  content: {
    margin: 10,
    flexDirection: 'row',
    padding: 10,
    borderWidth: 4,
    borderRadius: 18,
    elevation: 10,
  },
});

import {useData} from '../components/DataContext';

export const DraftList = withTheme((props) => {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Models = data.Models;

  const onSwitch = (model, value) => {
    model.selected = value;

    captain = checkCaptains(roster, model, value) ?? captain;
    setCaptain(captain);

    mascot = checkMascots(roster, model, value) ?? mascot;
    setMascot(mascot);

    squaddieCount = checkSquaddieCount(roster, model, squaddieCount, value);
    setSquadCount(squaddieCount);

    checkVeterans(roster, model, value);
    checkBenched(roster, model, value);

    if (captain && mascot && squaddieCount === 4) {
      setReady(true);
    } else if (ready) {
      setReady(false);
    }

    setRoster(roster);
  };

  // captain and mascot get pre-selected for minor guilds
  let [captain, setCaptain] = useState(props.guild.minor ? true : false);
  let [mascot, setMascot] = useState(props.guild.minor ? true : false);
  let [squaddieCount, setSquadCount] = useState(0);
  let [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      let team = _.cloneDeep(props.guild);
      team.roster = _.cloneDeep(roster.filter(m => m.selected));
      props.ready && props.ready(team.roster);
    } else {
      props.unready && props.unready();
    }
  }, [ready]);

  let [roster, setRoster] = useState(() => {
    // need to make a deep copy of the roster data
    let tmpRoster = _.cloneDeep(
      // Models.filter((m) => props.guild.roster.includes(m.id)),
      props.guild.roster.map((name) => Models.find((m) => m.id === name)),
    );
    // and add UI state
    tmpRoster.forEach((m) => {
      Object.assign(m, {selected: false, disabled: m.benched ? 1 : 0});
    });
    // pre-select captain and mascot for minor guilds
    if (props.guild.minor) {
      tmpRoster.forEach((m) => {
        if (m.captain || m.mascot) {
          m.selected = true;
          m.disabled = 1;
        }
      });
    }
    return tmpRoster;
  });

  let captains = roster.filter((m) => m.captain);
  let mascots = roster.filter((m) => m.mascot && !m.captain);
  let squaddies = roster.filter((m) => !m.captain && !m.mascot);

  return (
    <View
      style={[
        styles.content,
        {
          borderColor:
            props.theme.dark && props.guild.darkColor
              ? props.guild.darkColor
              : props.guild.color,
          backgroundColor: props.theme.colors.card,
        },
        props.style,
      ]}>
      <View style={{flex: -1}}>
        <Text>Captains :</Text>
        {captains.map((m) => (
          <DraftListItem
            key={keyName(m)}
            model={m}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
        <Text>Mascots :</Text>
        {mascots.map((m) => (
          <DraftListItem
            key={keyName(m)}
            model={m}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
      </View>
      <View style={{flex: -1}}>
        <Text>Squaddies :</Text>
        {squaddies.slice(0, squaddies.length / 2).map((m) => (
          <DraftListItem
            key={keyName(m)}
            model={m}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
      </View>
      <View style={{flex: -1}}>
        <Text />
        {squaddies.slice(squaddies.length / 2).map((m) => (
          <DraftListItem
            key={keyName(m)}
            model={m}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
      </View>
    </View>
  );
});

export const BlacksmithDraftList = withTheme((props) => {
  const {data, loading} = useData();
  if (loading) {
    return null;
  }
  const Models = data.Models;

  const onSwitch = (model, value) => {
    model.selected = value;

    masterCount = checkMasterCount(roster, model, masterCount, value);
    setMasterCount(masterCount);

    apprenticeCount = checkApprenticeCount(
      roster,
      model,
      apprenticeCount,
      value,
    );
    setApprenticeCount(apprenticeCount);

    checkVeterans(roster, model, value);
    checkBenched(roster, model, value);

    if (masterCount === 3 && apprenticeCount === 3) {
      setReady(true);
    } else if (ready) {
      setReady(false);
    }

    setRoster(roster);
  };

  let [masterCount, setMasterCount] = useState(0);
  let [apprenticeCount, setApprenticeCount] = useState(0);
  let [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      let team = _.cloneDeep(props.guild);
      team.roster = _.cloneDeep(roster.filter(m => m.selected));
      props.ready && props.ready(team.roster);
    } else {
      props.unready && props.unready();
    }
  }, [ready]);

  let [roster, setRoster] = useState(() => {
    // need to make a deep copy of the roster data
    let tmpRoster = _.cloneDeep(
      // Models.filter((m) => props.guild.roster.includes(m.id)),
      props.guild.roster.map((name) => Models.find((m) => m.id === name)),
    );
    // and add UI state
    tmpRoster.forEach((m) => {
      Object.assign(m, {selected: false, disabled: m.benched ? 1 : 0});
    });
    return tmpRoster;
  });

  let masters = roster.filter((m) => m.captain);
  let apprentices = roster.filter((m) => !m.captain);

  return (
    <View
      style={[
        styles.content,
        {
          borderColor: props.guild.color,
          backgroundColor: props.theme.colors.card,
        },
        props.style,
      ]}>
      <View style={{flex: -1}}>
        <Text>Masters :</Text>
        {masters.map((m) => (
          <DraftListItem
            model={m}
            key={keyName(m)}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
      </View>
      <View style={{flex: -1}}>
        <Text>Apprentices :</Text>
        {apprentices.slice(0, apprentices.length / 2).map((m) => (
          <DraftListItem
            model={m}
            key={keyName(m)}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
      </View>
      <View style={{flex: -1}}>
        <Text />
        {apprentices.slice(apprentices.length / 2).map((m) => (
          <DraftListItem
            model={m}
            key={keyName(m)}
            onPress={() => onSwitch(m, !m.selected)}
          />
        ))}
      </View>
    </View>
  );
});
