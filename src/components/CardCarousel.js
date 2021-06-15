import React, {useState} from 'react';
import {View} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import BoopCardView from '../components/BoopCard';
import DoubleCardView from '../components/DoubleCard';

const CardCarousel = React.forwardRef((props, ref) => {  
  landscape = props.landscape || false;;

  const [vheight, setHeight] = useState(0);
  const [vwidth, setWidth] = useState(0);

  const cardWidth = Math.min(
    // try and leave some margin
    vwidth * 0.8,
    // height constrained
    Math.min(700, vheight) * (landscape ? 10 / 7 : 5 / 7),
    // width constrained
    Math.min(landscape ? 1000 : 500, vwidth),
  );
  const cardHeight = (cardWidth * 7) / (landscape ? 10 : 5);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      onLayout={event => {
        setHeight(event.nativeEvent.layout.height);
        setWidth(event.nativeEvent.layout.width);
      }}>
      {!!vheight && !!vwidth && (
        <Carousel
          firstItem={props.firstItem}
          ref={ref}
          contentContainerCustomStyle={{
            alignItems: 'center',
          }}
          data={props.data}
          vertical={props.vertical || false}
          sliderHeight={vheight}
          // itemHeight={cardHeight}
          itemHeight={vheight}
          itemWidth={cardWidth}
          sliderWidth={vwidth}
          initialScrollIndex={0}
          // lockScrollWhileSnapping={true}
          // useScrollView={true}
          initialNumToRender={3}
          windowSize={3}
          maxToRenderPerBatch={2}
          removeClippedSubviews={false}
          renderItem={({index, item}) => (
            <View
              key={index}
              style={{
                flex: -1,
                width: '100%',
                maxWidth: landscape ? 1000 : 500,
                maxHeight: 700,
                aspectRatio: landscape ? 10 / 7 : 5 / 7,
                marginVertical: (vheight - cardHeight) / 2,
              }}>
              {landscape ? (
                <DoubleCardView {...item} />
              ) : (
                <BoopCardView {...item} />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
});

export default CardCarousel;
