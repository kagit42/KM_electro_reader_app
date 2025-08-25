import { Image, Pressable, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { SizeConfig } from '../../../assets/size/size';

const PreviewImageModal = ({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (props: boolean) => void;
}) => {
  console.log(modalVisible);

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={0}
      animationOutTiming={0}
      useNativeDriver
      onBackButtonPress={() => {
        setModalVisible(false);
      }}
      onBackdropPress={() => {
        setModalVisible(false);
      }}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setModalVisible(false)}
      >
        <Image
          source={require('../../../assets/images/details/meter.png')}
          style={styles.modalImage}
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '95%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: SizeConfig.width * 3,
  },
});

export default PreviewImageModal;
