import React, {useState} from 'react';
import {View} from 'react-native';

import {CardFront, CardBack} from './SingleCard';

export default function DoubleCardView(props) {
  var [scale, setScale] = useState(props.scale ?? 0);
  return (
    <View
      style={{flex: 1, flexDirection: 'row'}}
      onLayout={(event) => {
        let newScale = event.nativeEvent.layout.height / 700;
        if (scale !== newScale) {
          setScale(newScale);
        }
      }}>
      {!!scale && (
        <>
          <CardFront
            model={props.model}
            overlay={props.overlay}
            scale={scale}
            style={{
              borderRadius: 0,
              borderTopLeftRadius: 25 * scale,
              borderBottomLeftRadius: 25 * scale,
            }}
          />
          <CardBack
            model={props.model}
            overlay={props.overlay}
            scale={scale}
            style={{
              borderRadius: 0,
              borderTopRightRadius: 25 * scale,
              borderBottomRightRadius: 25 * scale,
            }}
          />
        </>
      )}
    </View>
  );
}
