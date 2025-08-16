import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BaseLayout from './components/BaseLayout';
import { COLORS } from '../../util/Theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParam } from '../../navigations/RootType';
import { SizeConfig } from '../../assets/size/size';

type OTPScreenProps = NativeStackScreenProps<RootStackParam, 'OTP'>;

const OTPScreen = ({ navigation }: OTPScreenProps) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleChange = (text: string, index: number) => {
    if (text === '' || /^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (index === 5 && text !== '') {
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const onVerifyPress = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }
    navigation.navigate('DrawerNav');
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
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit verification code
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => {
                if (el) inputRefs.current[index] = el;
              }}
              style={[
                styles.otpInput,
                focusedIndex === index && { borderColor: COLORS.accent },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Verify Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onVerifyPress}
            onPressIn={() => animateButton(0.95)}
            onPressOut={() => animateButton(1)}
            style={{ marginTop: 30 }}
          >
            <LinearGradient
              colors={[COLORS.secondary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.button,
                otp.join('').length !== 6 && { opacity: 0.5 },
              ]}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
              <MaterialIcons
                name="check-circle"
                size={22}
                color={COLORS.white}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Resend */}
        <TouchableOpacity style={{ marginTop: 20 }}>
          <Text style={styles.resendText}>
            Didn’t receive the code?{' '}
            <Text style={{ color: COLORS.accent, fontWeight: '600' }}>
              Resend
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </BaseLayout>
  );
};

export default OTPScreen;

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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SizeConfig.width * 3.3,
  },
  otpInput: {
    width: SizeConfig.width * 11.6,
    height: SizeConfig.width * 11.5,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: SizeConfig.width * 2.1,
    textAlign: 'center',
    fontSize: SizeConfig.fontSize * 4.1,
    fontWeight: '600',
    color: COLORS.black,
  },
  button: {
    flexDirection: 'row',
    height: SizeConfig.width * 11,
    borderRadius: SizeConfig.width * 3,
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
  resendText: {
    fontSize: SizeConfig.fontSize * 2.9,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
});
