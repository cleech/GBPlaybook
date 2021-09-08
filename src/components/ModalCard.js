import React from 'react';
import {StatusBar, View} from 'react-native';
import {Modal, Text, IconButton, withTheme} from 'react-native-paper';
// import {observer} from 'mobx-react-lite';

import BoopCard from './BoopCard';

const ModalCardView = withTheme(
  (props) => {
    const margin = StatusBar.currentHeight;
    return (
      <Modal
        dismissable={true}
        visible={props.visible}
        onDismiss={() => props.onClose()}
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
        contentContainerStyle={{
          flex: -1,
          width: '100%',
          maxWidth: 500,
          maxHeight: 700,
          aspectRatio: 5 / 7,
          alignSelf: 'center',
        }}>
        <BoopCard {...props} close={() => props.onClose()} />        
      </Modal>
    );
  }
);

export default ModalCardView;

import PropTypes from 'prop-types';

ModalCardView.propTypes = {
  model: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

ModalCardView.defaultProps = {
  visible: false,
  onClose: () => {},
};
