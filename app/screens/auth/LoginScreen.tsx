import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParam } from '../../navigations/RootType';
import BaseLayout from './components/BaseLayout';
import { COLORS } from '../../util/Theme';
import { SizeConfig } from '../../assets/size/size';
import { useSendOtpMutation } from '../../redux/slice/authSlice';
import { setItem } from '../../util/UtilityFunctions';

type LoginScreenProps = NativeStackScreenProps<RootStackParam, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isValidNumber = () => /^[0-9]{10}$/.test(mobileNumber);

  const [sendOtp] = useSendOtpMutation();

  const onContinuePress = async () => {
    if (!isValidNumber()) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number',
      );
      return;
    }

    try {
      const response = await sendOtp({ mobileNumber }).unwrap();
      console.log('verifyId', response.verify_id);

      setItem('verifyId', response?.verify_id);

      navigation.navigate('OTP', {
        mobileNumber,
        verifyId: response.verify_id,
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again later.');
    }
  };

  const animateButton = (toValue: number) => {
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <BaseLayout illustration={require('../../assets/images/global/login.png')}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in with your mobile number</Text>

        {/* Input */}
        <View
          style={[
            styles.inputWrapper,
            isFocused && { borderBottomColor: COLORS.accent },
          ]}
        >
          <MaterialIcons
            name="phone-iphone"
            size={22}
            color={isFocused ? COLORS.accent : COLORS.placeholder}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="number-pad"
            maxLength={10}
            value={mobileNumber}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={text => {
              const numericText = text.replace(/[^0-9]/g, '');
              setMobileNumber(numericText);
            }}
          />
        </View>

        {/* Error */}
        {!isValidNumber() && mobileNumber.length > 0 && (
          <Text style={styles.error}>Please enter a valid number.</Text>
        )}

        {/* Continue Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onContinuePress}
            onPressIn={() => animateButton(0.95)}
            onPressOut={() => animateButton(1)}
            disabled={!isValidNumber()}
            style={{ marginTop: 30 }}
          >
            <LinearGradient
              colors={[COLORS.secondary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, !isValidNumber() && { opacity: 0.5 }]}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <MaterialIcons
                name="arrow-forward"
                size={22}
                color={COLORS.white}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </BaseLayout>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    fontSize: SizeConfig.fontSize * 5.8,
    fontWeight: '800',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: SizeConfig.fontSize * 3.3,
    color: COLORS.placeholder,
    marginBottom: SizeConfig.width * 5.8,
    marginTop: SizeConfig.width * 1.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: SizeConfig.width * 1.2,
    marginTop: SizeConfig.width * 5,
  },
  inputIcon: {
    marginRight: SizeConfig.width * 2.1,
  },
  input: {
    flex: 1,
    height: SizeConfig.width * 9.3,
    color: COLORS.black,
    fontSize: SizeConfig.fontSize * 3.3,
  },
  error: {
    fontSize: SizeConfig.width * 2.7,
    color: COLORS.error,
    marginTop: SizeConfig.width * 0.82,
  },
  button: {
    flexDirection: 'row',
    height: SizeConfig.width * 11,
    borderRadius: SizeConfig.width * 2.9,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.width * 1.6,
    alignSelf: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: SizeConfig.fontSize * 3.3,
    color: COLORS.white,
    fontWeight: '600',
  },
});
