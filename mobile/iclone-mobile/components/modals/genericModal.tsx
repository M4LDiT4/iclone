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
  canClose?: boolean; // optional flag to control closing behavior
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
      onRequestClose={onClose} // Android back button
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // shadow for Android
  },
});

export default GenericModal;