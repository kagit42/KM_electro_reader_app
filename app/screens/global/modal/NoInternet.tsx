import { Modal, Text, View } from 'react-native';
import { SizeConfig } from '../../../assets/size/size';
import { colors, fonts } from '../../../util/Theme';
import LottieView from 'lottie-react-native';

export const NoInternet = ({
  showNoNetworkModal,
}: {
  showNoNetworkModal: boolean;
}) => {
  return (
    <Modal
      visible={showNoNetworkModal}
      transparent
      animationType="fade"
      statusBarTranslucent
      // onRequestClose={handleNoNetworkModal}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            paddingBottom: SizeConfig.width * 9,
            width: '80%',
            height: '35%',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: colors.borderColor,
            borderWidth: 1,
            backgroundColor: colors.white,
            borderRadius: SizeConfig.width * 3,
          }}
        >
          <LottieView
            source={require('../../../assets/lotties/home/noConnection.json')}
            style={{
              height: SizeConfig.width * 40,
              width: SizeConfig.width * 40,
              alignSelf: 'center',
            }}
            autoPlay
            loop
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: SizeConfig.fontSize * 3.5,
              color: colors.color_1A1A1A,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: SizeConfig.height,
              width: SizeConfig.width * 55,
            }}
          >
            Connection lost. Check your network and retry again.
          </Text>
        </View>
      </View>
    </Modal>
  );
};
