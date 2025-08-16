import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#f8f9fa'} barStyle="dark-content" />

      {/* Gradient background */}
      <LinearGradient
        colors={['#ffffff', '#f2f6ff']}
        style={styles.contentContainer}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/images/global/kalyani_light.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App version */}
        <Text style={styles.versionText}>App Version: v1.0.0</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer Text */}
        <Text style={styles.footerText}>
          © 2025 Kalyani Motors Pvt. Ltd. {'\n'}All Rights Reserved
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 240,
    height: 120,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '60%',
    marginVertical: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});
