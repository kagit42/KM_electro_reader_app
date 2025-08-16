import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const COLORS = {
  primary: '#11998e',
  secondary: '#38ef7d',
  accent: '#FF9F43',
  white: '#FFFFFF',
  black: '#1C1C1E',
  placeholder: '#8E8E93',
  error: '#FF3B30',
};

interface BaseAuthScreenProps {
  illustration: any;
  children: ReactNode;
}

const BaseLayout: React.FC<BaseAuthScreenProps> = ({
  illustration,
  children,
}) => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.container}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/global/kalyani_dark.png')}
              style={styles.logo}
            />
          </View>

          {/* Illustration */}
          <View style={styles.illustrationWrapper}>
            <Image
              source={illustration}
              resizeMode="contain"
              style={styles.illustration}
            />
          </View>

          {/* White Card */}
          <View style={styles.card}>
            {children}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing you agree to the{' '}
                <Text style={{ color: COLORS.accent, fontWeight: '600' }}>
                  Terms <Text style={styles.footerText}>& </Text>
                  conditions
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default BaseLayout;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
    paddingHorizontal: 18,
  },
  logo: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  illustrationWrapper: {
    position: 'absolute',
    top: 180,
    right: 100,
    justifyContent: 'center',
  },
  illustration: {
    width: 280,
    height: 200,
  },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    minHeight: '55%',
    elevation: 6,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.placeholder,
    fontSize: 14,
  },
});
