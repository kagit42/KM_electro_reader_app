import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { SizeConfig } from '../../../assets/size/size';
import { colors, fonts } from '../../../utils/Theme';

const NetworkIssueScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View style = {{
        alignItems : 'center',
        justifyContent : 'center'
      }} >
        <LottieView
        source={require('../../../assets/lotties/auth/noInternet.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <View style = {{
        position : 'absolute',
        bottom : -SizeConfig.height * 2

      }} >
        <Text style={styles.title}>No Internet Connection</Text>

        <Text style={styles.subtitle}>
          It looks like you are offline. Please check your network settings and
          try again.
        </Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SizeConfig.width * 10,
  },
  lottie: {
    width: SizeConfig.width * 60,
    height: SizeConfig.width *60,
    // backgroundColor : 'red'
  },
  title: {
    fontSize: SizeConfig.fontSize * 4.5,
    color: colors.black,
    marginBottom: SizeConfig.height,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
  },
  subtitle: {
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.secondary,
    marginBottom: SizeConfig.height,
    textAlign: 'center',
    fontFamily: fonts.medium,
    lineHeight: SizeConfig.height * 2,
  },
});

export default NetworkIssueScreen;
