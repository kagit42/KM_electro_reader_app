import {
  Image,
  StatusBar,
  Text,
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomInput from '../../global/CustomInput';
import { useEffect, useRef, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../global/CustomButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationType } from '../../navigations/NavigationType';
import { ShowToast } from '../../utils/UtilityFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSendOtpMutation } from '../../redux/slices/authSlice';
import * as Keychain from 'react-native-keychain';
import { useNetwork } from '../../ContextApi/NetworkProvider';

type SendOtpProps = NativeStackScreenProps<NavigationType, 'SendOtp'>;

const SendOtp = ({ navigation }: SendOtpProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const phoneNumberRef = useRef<TextInput>(null);

  const { isConnected } = useNetwork();

  const [sendApiTrigger] = useSendOtpMutation();

  useEffect(() => {
    setTimeout(() => {
      phoneNumberRef.current?.focus();
    }, 1000);

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onSubmit = async () => {
    if (phoneNumber.length == 10) {
      try {
        setIsLoading(true);

        let response = await sendApiTrigger({
          mobileNumber: phoneNumber,
        }).unwrap();

        if (response) {
          let customObject = {
            mobile_number: response?.mobile_number,
            verify_id: response?.verify_id,
          };
          let makingStringfy = JSON.stringify(customObject);
          await Keychain.setGenericPassword('sendOtpObj', makingStringfy, {
            service: 'otp_section',
          });
        }

        navigation.navigate('VerifyOtp', { mobile_number: phoneNumber });
      } catch (error) {
        console.log('Send Otp ', error);

        ShowToast({
          title: 'Something Went Wrong',
          description:
            'It may cause due to unstable internet try again later or different service',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      ShowToast({
        title: 'Invalid Phone Number',
        description: 'Please verify the phone number and try again.',
        type: 'error',
      });

      setTimeout(() => {
        phoneNumberRef.current?.focus();
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#F2F6F8'} barStyle="dark-content" />

      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.bannerWrapper}>
              <Image
                source={require('../../assets/images/auth/authBanner.png')}
                style={styles.bannerImage}
              />
            </View>

            <View style={styles.contentWrapper}>
              <View style={styles.innerContent}>
                <View>
                  <Text style={styles.title}>Log In</Text>

                  <View
                    style={{
                      gap: SizeConfig.height * 4,
                    }}
                  >
                    <CustomInput
                      inputText={phoneNumber}
                      ref={phoneNumberRef}
                      setInputText={(text: string) => {
                        let cleaned = text.replace(/[^0-9]/g, '');
                        setPhoneNumber(cleaned);
                        if (cleaned.length === 10) {
                          Keyboard.dismiss();
                        }
                      }}
                      placeholderText="Phone Number"
                      LHSIcon={
                        <MaterialIcons
                          name="call"
                          size={SizeConfig.width * 4.5}
                          color={colors.color_4C5F66}
                        />
                      }
                      keyboardType="numeric"
                      maxLength={10}
                    />

                    <CustomButton
                      text="Send Otp"
                      isLoading={isLoading}
                      linearGradientStyle={styles.button}
                      linearGradientColor={[colors.success, colors.success]}
                      onPress={() => {
                        if (isConnected) {
                          onSubmit();
                        } else {
                          ShowToast({
                            title: 'No Service Provider',
                            description: 'No Internet connection found !',
                            type: 'error',
                          });
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <View
          style={[
            styles.footer,
            { display: isKeyboardVisible ? 'none' : 'flex' },
          ]}
        >
          <Text style={styles.policyText}>
            By continuing, you agree to our Policy.
          </Text>
          <Text style={styles.linkText}>Terms & Conditions and Privacy</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6F8',
  },
  bannerWrapper: {
    backgroundColor: '#F2F6F8',
    height: SizeConfig.height * 30,
  },
  bannerImage: {
    width: SizeConfig.width * 100,
    height: SizeConfig.height * 35,
    resizeMode: 'stretch',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F2F6F8',
  },
  innerContent: {
    flex: 1,
    borderTopRightRadius: SizeConfig.width * 8,
    borderTopLeftRadius: SizeConfig.width * 8,
    paddingTop: SizeConfig.height * 5,
    paddingHorizontal: SizeConfig.width * 6,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: SizeConfig.fontSize * 4.5,
    color: colors.color_2F3739,
    marginBottom: SizeConfig.height * 2,
  },
  button: {
    paddingVertical: SizeConfig.height * 1.7,
    width: '80%',
    borderRadius: SizeConfig.width * 5,
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SizeConfig.height * 5,
  },
  policyText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.2,
    color: colors.black,
  },
  linkText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.primary,
    textDecorationLine: 'underline',
    // marginTop: SizeConfig.height * 1,
  },
});

export default SendOtp;
