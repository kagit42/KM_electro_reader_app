import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../utils/Theme';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: SizeConfig.height,
        }}
      >
        <Image
          source={require('../../assets/images/global/kalyani_light.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.versionText}>App Version: v1.0.0</Text>
        <Text style={styles.footerText}>
          © 2025 Kalyani Motors Pvt. Ltd. {'\n'}All Rights Reserved
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  logo: {
    width: SizeConfig.width * 30,
    height: SizeConfig.height * 5,
  },
  versionText: {
    fontSize: SizeConfig.fontSize * 3.5,
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  footerText: {
    fontSize: SizeConfig.fontSize * 3,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: SizeConfig.height * 2.5,
  },
});
