import React from 'react';
import {StatusBar, View, TouchableWithoutFeedback} from 'react-native';
import {Modal, Text, IconButton, withTheme} from 'react-native-paper';
// import {observer} from 'mobx-react-lite';

import CardCarousel from '../components/CardCarousel';
// import BoopCard from './BoopCard';

const ModalCardCarousel = React.forwardRef((props, ref) => {
  const margin = StatusBar.currentHeight;  
  return (
    <Modal
      // dismissable={true}
      visible={props.visible}      
      // onDismiss={props.onClose}
      style={{
        marginTop: 0,
        marginBottom: 0,
      }}
      contentContainerStyle={{
        flex: -1,
        width: '100%',
        height: '100%',
      }}>
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={{width: '100%', height: '100%'}}>
          <CardCarousel vertical={true} data={props.data} ref={ref} 
          firstItem={props.firstItem} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default ModalCardCarousel;

import PropTypes from 'prop-types';

ModalCardCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

ModalCardCarousel.defaultProps = {
  visible: false,
  onClose: () => {},
};
