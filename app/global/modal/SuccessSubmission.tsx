import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../utils/Theme';
import CustomButton from '../CustomButton';

type SuccessSubmissionProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const SuccessSubmission = ({
  modalVisible,
  setModalVisible,
}: SuccessSubmissionProps) => {
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
            <Text style={styles.sectionTitle}>Submitted!</Text>
            <Text style={styles.subText}>
              Your reading has been submitted successfully. {'\n'}
              The data is stored securely in our system. {'\n'}
              Visit history anytime to review past records.
            </Text>
          </View>

          <CustomButton
            text="Back"
            linearGradientColor={[colors.success, colors.success]}
            linearGradientStyle={styles.button}
            TextStyle={styles.buttonText}
            onPress={() => {
              setModalVisible(false);
            }}
          />
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
    paddingHorizontal: SizeConfig.width * 4,
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
    paddingVertical: SizeConfig.width * 3,
    width: SizeConfig.width * 40,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SizeConfig.width * 10,
  },
  buttonText: {
    fontFamily: fonts.medium,
  },
});

export default SuccessSubmission;
