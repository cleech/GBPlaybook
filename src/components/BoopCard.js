import React, {useState, useRef} from 'react';
import {TouchableHighlight, View} from 'react-native';
import CardFlip from 'react-native-card-flip';

import {CardFront, CardBack} from './SingleCard';

import {withTheme} from 'react-native-paper';

const BoopCardView = withTheme((props) => {
  let card = useRef(null);
  const [scale, setScale] = useState(props.scale ?? 0);

  return (
    <View
      style={{flex: 1}}
      onLayout={(event) => {
        let newScale = event.nativeEvent.layout.height / 700;
        if (scale !== newScale) {
          setScale(newScale);
        }
      }}>
      {!!scale && (
        <TouchableHighlight
          underlayColor={props.theme.colors.background}
          style={{flex: 1, borderRadius: 25 * scale}}
          onPress={() => card.flip()}>
          <CardFlip style={{flex: 1}} ref={(r) => (card = r)}>
            <CardFront scale={scale} {...props} />
            <CardBack scale={scale }{...props} />
          </CardFlip>
        </TouchableHighlight>
      )}
    </View>
  );
});

export default BoopCardView;
