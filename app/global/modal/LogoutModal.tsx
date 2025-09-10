import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../utils/Theme';
import CustomButton from '../CustomButton';
import { useNavigation } from '@react-navigation/native';
import { removeKeychainsLogout } from '../../utils/UtilityFunctions';

type LogoutModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const LogoutModal = ({ modalVisible, setModalVisible }: LogoutModalProps) => {
  const navigation = useNavigation<any>();

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={styles.centeredContainer}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalBox}>
          <Image
            source={require('../../assets/images/modal/success.png')}
            style={styles.modalImage}
          />

          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Confirmation</Text>
            <Text style={styles.subText}>
              Are you sure you want to log out? Don’t worry, your data will
              remain safe. You can access it again by logging back in.
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: SizeConfig.width * 3,
            }}
          >
            <CustomButton
              text="Cancel"
              linearGradientColor={[colors.primary, colors.secPrimary]}
              linearGradientStyle={styles.button}
              TextStyle={styles.buttonText}
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <CustomButton
              text="Logout"
              linearGradientColor={['#ff2c2cdb', '#ff2c2cdb']}
              linearGradientStyle={styles.button}
              TextStyle={styles.buttonText}
              onPress={async () => {
                await removeKeychainsLogout();
                setModalVisible(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SendOtp' }],
                });
              }}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
  },
  modalBox: {
    backgroundColor: colors.white,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SizeConfig.width * 5,
    paddingVertical: SizeConfig.height * 4,
    gap: SizeConfig.height * 3,
    borderRadius: SizeConfig.width * 5,
  },
  modalImage: {
    width: SizeConfig.width * 13,
    height: SizeConfig.width * 13,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.height,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4.3,
    color: colors.black,
  },
  subText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.black,
    textAlign: 'center',
    lineHeight: SizeConfig.height * 2.5,
  },
  button: {
    paddingVertical: SizeConfig.width * 2.8,
    width: SizeConfig.width * 33,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.medium,
  },
});

export default LogoutModal;
