import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface GenericModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  canClose?: boolean;
}

const GenericModal: React.FC<GenericModalProps> = ({
  visible,
  onClose,
  children,
  canClose = true,
}) => {
  const handleOverlayPress = () => {
    if (canClose) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Click outside → close */}
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.fill} />
        </TouchableWithoutFeedback>

        {/* Modal content - NOT wrapped in TouchableWithoutFeedback */}
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fill: {
    ...StyleSheet.absoluteFillObject, // covers the entire screen
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    zIndex: 2,
  },
});

export default GenericModal;
