import { Image, Modal, Pressable, StyleSheet } from 'react-native';
import { SizeConfig } from '../../assets/size/size';

const PreviewImageModal = ({
  modalVisible,
  setModalVisible,
  url,
}: {
  modalVisible: boolean;
  setModalVisible: (props: boolean) => void;
  url?: string;
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={styles.centeredContainer}
        onPress={() => setModalVisible(false)}
      >
        <Image
          source={
            url ? { uri: url } : require('../../assets/images/modal/meter.png')
          }
          style={styles.modalImage}
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: '88%',
    height: '45%',
    resizeMode: 'contain',
    borderRadius: SizeConfig.width * 3,
  },
});

export default PreviewImageModal;
