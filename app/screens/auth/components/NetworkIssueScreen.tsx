import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { SizeConfig } from '../../../assets/size/size';
import { colors, fonts } from '../../../utils/Theme';

const NetworkIssueScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: SizeConfig.height * 1.5,
        }}
      >
        <Image
          source={require('../../../assets/images/auth/noInternet.png')}
          style={styles.img}
        />

        <View>
          <Text style={styles.title}>No Internet Connection</Text>

          <Text style={styles.subtitle}>
            It looks like you are offline. {'\n'} Please check your network
            settings and try again.
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
  img: {
    width: SizeConfig.width * 30,
    height: SizeConfig.width * 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: SizeConfig.fontSize * 4.5,
    color: colors.black,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
  },
  subtitle: {
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
});

export default NetworkIssueScreen;
