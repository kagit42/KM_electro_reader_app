import {
  BackHandler,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SizeConfig } from '../../assets/size/size';
import CustomButton from '../CustomButton';
import { colors } from '../../utils/Theme';
import { ShowToast } from '../../utils/UtilityFunctions';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const OcrExtractionModal = ({
  modalVisible,
  setModalVisible,
  url,
  isLoading = false,
  handleSubmit,
}: {
  modalVisible: boolean;
  setModalVisible: (props: boolean) => void;
  url?: string;
  isLoading?: boolean;
  handleSubmit: () => void;
}) => {
  const { isConnected } = useNetwork();

  useEffect(() => {
    let backHandler: any;

    if (isLoading && modalVisible) {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
    }

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [isLoading, modalVisible]);

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      // onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredContainer}>
        <Image
          source={
            url ? { uri: url } : require('../../assets/images/modal/meter.png')
          }
          style={styles.modalImage}
        />

        <View style={styles.footer}>
          <CustomButton
            linearGradientColor={['#FD5454FF', '#FD5454FF']}
            text="Cancel"
            linearGradientStyle={styles.btnStyle}
            onPress={() => {
              if (!isLoading) {
                setModalVisible(false);
              }
            }}
          />
          <CustomButton
            linearGradientColor={[colors.primary, colors.primary]}
            text="Submit"
            linearGradientStyle={styles.btnStyle}
            isLoading={isLoading}
            onPress={() => {
              if (isConnected) {
                if (!isLoading) handleSubmit();
              } else {
                ShowToast({
                  title: 'No Service Provider',
                  description: 'No Internet connection found !',
                  type: 'error',
                });
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    gap: SizeConfig.height * 3,
  },
  modalImage: {
    width: SizeConfig.width * 80,
    height: SizeConfig.width * 80,
    resizeMode: 'cover',
    borderRadius: SizeConfig.width * 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.width * 5,
  },
  btnStyle: {
    width: SizeConfig.width * 35,
    height: SizeConfig.height * 6.5,
    borderRadius: SizeConfig.width * 4,
    borderWidth: 0,
  },
});

export default OcrExtractionModal;
