import React from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../utils/Theme';

interface NoInternetProps {
  showNoNetworkModal: boolean;
}

export const NoInternet: React.FC<NoInternetProps> = ({
  showNoNetworkModal,
}) => {
  return (
    <Modal
      visible={showNoNetworkModal}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View
            style={{
              height: SizeConfig.height * 18,
            }}
          >
            <LottieView
              source={require('../../assets/lotties/home/noConnection.json')}
              style={styles.animation}
              autoPlay
              loop
            />
          </View>
          <Text
            style={[
              styles.message,
              {
                fontFamily: fonts.semiBold,
                fontSize: SizeConfig.fontSize * 3.9,
                color: colors.pureBlack,
              },
            ]}
          >
            No Internet
          </Text>
          <Text style={styles.message}>
            Connection lost. Check your network and retry again.
          </Text>
        </View>
      </View>
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
  container: {
    width: '80%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 3,
  },
  animation: {
    width: SizeConfig.width * 40,
    height: SizeConfig.width * 40,
    alignSelf: 'center',
  },
  message: {
    width: SizeConfig.width * 55,
    fontSize: SizeConfig.fontSize * 3.5,
    fontFamily: fonts.regular,
    color: colors.pureBlack,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
