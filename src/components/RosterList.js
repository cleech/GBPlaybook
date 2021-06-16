import React, {useState} from 'react';
import {View, SectionList, TouchableOpacity, StyleSheet} from 'react-native';
import {List, Portal, Text, withTheme} from 'react-native-paper';
import {observer, Observer} from 'mobx-react-lite';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import GBIcons from '../components/GBIcons';
import {displayName} from '../components/GuildData';
// import ModalCardView from '../components/ModalCard';
import ModalCardCarousel from '../components/ModalCardCarousel';

import Color from 'color';

const RockerButton = withTheme(props => (
  <View
    style={[
      {
        flex: -1,
        flexDirection: 'row',
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: props.theme.colors.surface,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // height: 32,
        // minWidth: 64,
        height: 24,
        minWidth: 96,
      },
      props.style,
    ]}>
    <TouchableOpacity
      style={{
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={props.minusPress}
      onLongPress={props.minusLongPress}>
      <Icons name="minus" color={props.theme.colors.onSurface} />
    </TouchableOpacity>
    <View
      style={{
        flex: 0,
        width: 1,
        height: '80%',
        backgroundColor: Color(props.theme.colors.onSurface)
          .alpha(0.25)
          .string(),
      }}
    />
    <TouchableOpacity
      style={{
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={props.plusPress}
      onLongPress={props.plusLongPress}>
      <Icons name="plus" color={props.theme.colors.onSurface} />
    </TouchableOpacity>
  </View>
));

const HealthBox = withTheme(
  observer(props => (
    <View
      style={{
        alignItems: 'center',
        padding: 5,
      }}>
      <View style={{flex: 0}}>
        <Text style={{fontSize: 20}}>
          {String(props.model.health).padStart(2, '0') +
            ' / ' +
            String(props.model.hp).padStart(2, '0')}
        </Text>
      </View>
      <RockerButton
        minusPress={() => {
          if (props.model.health > 0) {
            props.model.setHealth(props.model.health - 1);
          }
        }}
        minusLongPress={() => {
          props.model.setHealth(0);
        }}
        plusPress={() => {
          if (props.model.health < props.model.hp) {
            props.model.setHealth(props.model.health + 1);
          }
        }}
        plusLongPress={() => {
          if (props.model.health < props.model.recovery) {
            props.model.setHealth(props.model.recovery);
          }
        }}
      />
    </View>
  )),
);

const StatLine = props => (
  // <View
  // style={{
  // flex: -1,
  // flexDirection: 'row',
  // justifyContent: 'space-evenly',
  //////////
  // borderWidth: 1,
  // borderColor: 'red',
  // }}>
  <Text>
    <Text>{`${props.model.jog}"/${props.model.sprint}" | `}</Text>
    <Text>{`${props.model.tac} | `}</Text>
    <Text>{`${props.model.kickdice}/${props.model.kickdist}" | `}</Text>
    <Text>{`${props.model.def}+ | `}</Text>
    <Text>{`${props.model.arm} | `}</Text>
    <Text>{`${props.model.inf}/${props.model.infmax}`}</Text>
  </Text>
  // </View>
);

const ModelView = props => (
  <List.Item
    style={{
      flex: 1,
      padding: 0,
      //////////
      // borderWidth: 1,
      // borderColor: 'blue',
    }}
    title={displayName(props.model)}
    // titleStyle={{fontFamily: 'IMFellGreatPrimerSC-Regular'}}
    description={<StatLine model={props.model} />}
    // descriptionStyle={{fontFamily: 'CrimsonText-Bold'}}
    onPress={props.onPress}
    right={() => <HealthBox {...props} />}
  />
);

const SectionHeader = withTheme(props => (
  <List.Item
    style={{flex: 1, backgroundColor: props.theme.colors.surface}}
    title={props.title}
    // titleStyle={{fontFamily: 'IMFellGreatPrimerSC-Regular'}}
    description={() => (
      <Text>
        {props.data.reduce((acc, m) => acc + (m._inf ?? m.inf), 0)} INF
      </Text>
    )}
    left={() => (
      <GBIcons
        name={props.title}
        size={32}
        style={{alignSelf: 'center', color: props.theme.colors.text}}
      />
    )}
    right={() => (
      <View style={{flexDirection: 'row'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Observer>{() => <Text>VPs: {props.team.score}</Text>}</Observer>
          <RockerButton
            minusPress={() => {
              if (props.team.score > 0) {
                props.team.setScore(props.team.score - 1);
              }
            }}
            plusPress={() => {
              props.team.setScore(props.team.score + 1);
            }}
          />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Observer>{() => <Text>MOM: {props.team.momentum}</Text>}</Observer>
          <RockerButton
            minusPress={() => {
              if (props.team.momentum > 0) {
                props.team.setMomentum(props.team.momentum - 1);
              }
            }}
            plusPress={() => {
              props.team.setMomentum(props.team.momentum + 1);
            }}
          />
        </View>
      </View>
    )}
    onPress={props.onPress}
  />
));

const RosterList = props => {
  const [showCard, setCard] = useState(false);
  const showModal = () => setCard(true);
  const hideModal = () => setCard(false);

  // const [active, setActive] = useState(props.teams[0].roster[0]);
  // const [overlay, setOverlay] = useState(false);

  const data = props.teams.flatMap(t => [
    {model: {id: t.name}, overlay: false, close: hideModal},
    ...t.roster.map(m => ({
      model: m,
      overlay: true,
      controls: true,
      close: hideModal,
    })),
  ]);

  const [firstItem, setFirstItem] = useState(0);
  var nextOffset = 0;

  return (
    <View style={{flex: 1}}>
      <Portal.Host>
        <Portal>
          {/* <ModalCardView
            model={active}
            visible={showCard}
            overlay={overlay}
            controls={overlay}
            onClose={hideModal}
          /> */}
          <ModalCardCarousel
            data={data}
            onClose={hideModal}
            visible={showCard}
            firstItem={firstItem}
            cardWidth={0.95}
          />
        </Portal>
        <SectionList
          stickySectionHeadersEnabled={true}
          sections={props.teams.map(t => {
            const offset = nextOffset;
            nextOffset += t.roster.length + 1;
            return {
              title: t.name,
              team: t,
              data: t.roster.slice(),
              offset: offset,
            };
          })}
          renderSectionHeader={({section: {title, team, data, offset}}) => (
            <SectionHeader
              title={title}
              team={team}
              data={data}
              onPress={() => {
                // setActive({id: title});
                // setOverlay(false);
                setFirstItem(offset);
                showModal();
              }}
            />
          )}
          renderItem={({item, index, section}) => {
            return (
              <ModelView
                model={item}
                onPress={() => {
                  // setActive(item);
                  // setOverlay(true);
                  setFirstItem(index + 1 + section.offset);
                  showModal();
                }}
              />
            );
          }}
          keyExtractor={(_item, index) => index.toString()}
        />
      </Portal.Host>
    </View>
  );
};

export default RosterList;
