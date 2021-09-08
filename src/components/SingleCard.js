import React, {useState} from 'react';
import {View, ImageBackground} from 'react-native';
import {Text, IconButton, withTheme} from 'react-native-paper';
import {observer} from 'mobx-react-lite';

import {CardFrontOverlay, CardBackOverlay} from './CardOverlay';
import {
  CardFrontOverlay as GBCPFrontOverlay,
  CardBackOverlay as GBCPBackOverlay,
} from './CardOverlayGBCP';
import GBImages from '../components/GBImages';

const HealthControl = withTheme(
  observer(props => (
    <View
      style={[
        {
          position: 'absolute',
          right: 25,
          bottom: 12.5,
          alignItems: 'center',
          backgroundColor: props.theme.colors.surface,
          borderColor: props.theme.colors.text,
          borderWidth: 1,
          borderRadius: 12.5,
          zIndex: 2,
        },
        props.style,
      ]}>
      <Text style={{fontSize: 28}}>
        {String(props.model.health).padStart(2, '0') +
          ' / ' +
          String(props.model.hp).padStart(2, '0')}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <IconButton
          icon="minus"
          size={28}
          onPress={() => {
            if (props.model.health > 0) {
              props.model.setHealth(props.model.health - 1);
            }
          }}
          onLongPress={() => {
            props.model.setHealth(0);
          }}
        />
        <IconButton
          icon="plus"
          size={28}
          onPress={() => {
            if (props.model.health < props.model.hp) {
              props.model.setHealth(props.model.health + 1);
            }
          }}
          onLongPress={() => {
            if (props.model.health < props.model.recovery) {
              props.model.setHealth(props.model.recovery);
            }
          }}
        />
      </View>
    </View>
  )),
);

const GBCPHealthControl = withTheme(
  observer(props => (
    <View
      style={[
        {
          position: 'absolute',
          right: 5,
          bottom: 12.5,
          alignItems: 'center',
          backgroundColor: props.theme.colors.surface,
          borderColor: props.theme.colors.text,
          borderWidth: 1,
          borderRadius: 12.5,
          zIndex: 2,
        },
        props.style,
      ]}>
      <Text style={{fontSize: 28}}>
        {String(props.model.health).padStart(2, '0') +
          ' / ' +
          String(props.model.hp).padStart(2, '0')}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <IconButton
          icon="minus"
          size={26}
          onPress={() => {
            if (props.model.health > 0) {
              props.model.setHealth(props.model.health - 1);
            }
          }}
          onLongPress={() => {
            props.model.setHealth(0);
          }}
        />
        <IconButton
          icon="plus"
          size={26}
          onPress={() => {
            if (props.model.health < props.model.hp) {
              props.model.setHealth(props.model.health + 1);
            }
          }}
          onLongPress={() => {
            if (props.model.health < props.model.recovery) {
              props.model.setHealth(props.model.recovery);
            }
          }}
        />
      </View>
    </View>
  )),
);

const CloseButton = withTheme(props => (
  <IconButton
    icon="close-circle"
    size={25}
    color="white"
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 2,
    }}
    onPress={() => {
      props.close();
    }}
  />
));

const CardFront = props => {
  const model = props.model;
  const key = model.id;
  const [scale, setScale] = useState(props.scale ?? 0);

  // if (model.id === 'Tenderiser') {
  //   console.log(model);
  // }

  return (
    <View
      style={{flex: 1}}
      onLayout={event => {
        let newScale = event.nativeEvent.layout.height / 700;
        if (scale !== newScale) {
          setScale(newScale);
        }
      }}>
      {!!scale && (
        <ImageBackground
          source={GBImages[key + '_front']}
          style={[
            {
              flex: 1,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25 * scale,
              elevation: 10,
            },
            props.style,
          ]}
          // to crop out print bleed from card images
          // imageStyle={{width: '110%', marginLeft: '-5%'}}
          imageStyle={
            model.gbcp ? {width: '100%'} : {width: '110%', marginLeft: '-5%'}
          }>
          {/* transformed view for scaling card overlay controls */}
          <View
            transform={[{scale: scale}]}
            style={{
              // position: 'absolute',
              width: 500,
              height: 700,
              aspectRatio: 5 / 7,
              // alignSelf: 'center',
              zIndex: 1,
            }}>
            {/* Native text card overlay */}
            {props.overlay &&
              (!model.gbcp ? (
                <CardFrontOverlay model={model} />
              ) : (
                <GBCPFrontOverlay model={model} />
              ))}
            {/* close button */}
            {props.close && <CloseButton close={props.close} />}
            {/* heath control box */}
            {props.controls &&
              (!model.gbcp ? (
                <HealthControl {...props} />
              ) : (
                <GBCPHealthControl {...props} />
              ))}
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

const CardBack = props => {
  const model = props.model;
  const key = model.id;
  const [scale, setScale] = useState(props.scale ?? 0);

  return (
    <View
      style={{flex: 1}}
      onLayout={event => {
        let newScale = event.nativeEvent.layout.height / 700;
        if (scale !== newScale) {
          setScale(newScale);
        }
      }}>
      {!!scale && (
        <ImageBackground
          source={GBImages[key + '_back']}
          style={[
            {
              flex: 1,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25 * scale,
              elevation: 10,
            },
            props.style,
          ]}
          // to crop out print bleed from card images
          // imageStyle={{width: '110%', marginLeft: '-5%'}}>
          imageStyle={
            model.gbcp ? {width: '100%'} : {width: '110%', marginLeft: '-5%'}
          }>
          {/* transformed view for scaling card overlay controls */}
          <View
            transform={[{scale: scale}]}
            style={{
              // position: 'absolute',
              width: 500,
              height: 700,
              aspectRatio: 5 / 7,
              // alignSelf: 'center',
              zIndex: 1,
            }}>
            {/* Native text card overlay */}
            {props.overlay && !model.gbcp && <CardBackOverlay model={model} />}
            {/* close button */}
            {props.close && <CloseButton close={props.close} />}
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

export {CardFront, CardBack};
