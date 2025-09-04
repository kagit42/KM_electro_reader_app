import {
  Image,
  StatusBar,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomButton from '../../global/CustomButton';
import CustomOtpInput from './components/OtpInput';
import { useEffect, useRef, useState } from 'react';
import { ShowToast } from '../../utils/UtilityFunctions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationType } from '../../navigations/NavigationType';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '../../redux/slices/authSlice';
import * as Keychain from 'react-native-keychain';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { OtpInputRef } from 'react-native-otp-entry';

type VerifyOtpProps = NativeStackScreenProps<NavigationType, 'VerifyOtp'>;

const VerifyOtp = ({ navigation, route }: VerifyOtpProps) => {
  const [otp, setOtp] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendPress, setResendPress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpRef = useRef<OtpInputRef>(null);

  const [verifyOtpTrigger] = useVerifyOtpMutation();
  const [sendApiTrigger] = useSendOtpMutation();

  const { isConnected } = useNetwork();

  let mobile_number = route?.params?.mobile_number;

  useEffect(() => {
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

  const onResendSubmit = async () => {
    if (mobile_number.length == 10) {
      try {
        let response = await sendApiTrigger({
          mobileNumber: mobile_number,
        }).unwrap();
        console.log(response);

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
      } catch (error) {
        console.log('Verify Otp ', error);

        ShowToast({
          title: 'Something Went Wrong',
          description:
            'It may cause due to unstable internet try again later or different service',
          type: 'error',
        });
      }
    } else {
      ShowToast({
        title: 'Invalid Phone Number',
        description: 'Please verify the phone number and try again.',
        type: 'error',
      });
    }
  };

  const handleReSendOtpTimer = () => {
    const id = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setResendPress(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onVerifyOtp = async () => {
    try {
      if (otp.length == 6) {
        setIsLoading(true);

        const sendOtpObject = await Keychain.getGenericPassword({
          service: 'otp_section',
        });

        if (sendOtpObject) {
          const parsedData = JSON.parse(sendOtpObject?.password);

          if (parsedData?.verify_id) {
            let response = await verifyOtpTrigger({
              verifyid: parsedData?.verify_id,
              otp: otp,
            }).unwrap();

            console.log(response);

            if (response) {
              let customObject = {
                access_token: response?.access_token,
                is_registered: response?.is_registered,
              };
              let makingStringfy = JSON.stringify(customObject);
              await Keychain.setGenericPassword(
                'access_token',
                makingStringfy,
                {
                  service: 'verifyOtp_service',
                },
              );
            }

            if (response?.is_registered) {
              navigation.navigate('DrawerNavigation');
            } else {
              navigation.navigate('CreateNewUser');
            }
          }
        }
      } else {
        ShowToast({
          title: 'Invalid OTP',
          description: 'Please verify the OTP number and try again.',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.log(error);

      if (
        error.data.message == 'OTP verification failed: Invalid Request/OTP'
      ) {
        ShowToast({
          title: 'Invalid OTP',
          description: 'Please verify the OTP number and try again.',
          type: 'error',
        });
      } else {
        ShowToast({
          title: 'Somthing Went Wrong',
          description: error.data.message,
          type: 'error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#F2F6F8'} barStyle="dark-content" />

      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          // behavior={'height'}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            // keyboardShouldPersistTaps="handled"
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
                <View style={styles.inputSection}>
                  <View>
                    <Text style={styles.title}>OTP Validation</Text>
                    <Text style={styles.subTitle}>
                      We have sent OTP on your number
                    </Text>
                  </View>

                  <View
                    style={{
                      gap: SizeConfig.height * 4,
                    }}
                  >
                    <CustomOtpInput otpRef={otpRef} setOtp={setOtp} />

                    <View
                      style={{
                        flexDirection: 'row',
                        gap: SizeConfig.width * 2,
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <View>
                        <CustomButton
                          text="Resend OTP"
                          linearGradientStyle={[
                            styles.button,
                            { display: resendPress ? 'none' : 'flex' },
                          ]}
                          linearGradientColor={[colors.border, colors.border]}
                          TextStyle={{ color: colors.secondary }}
                          onPress={() => {
                            if (isConnected) {
                              otpRef.current?.clear();
                              onResendSubmit();
                              setResendPress(true);
                              setResendTimer(60);
                              handleReSendOtpTimer();
                            } else {
                              ShowToast({
                                title: 'No Service Provider',
                                description: 'No Internet connection found !',
                                type: 'error',
                              });
                            }
                          }}
                        />
                        <View
                          style={{
                            position: resendPress ? 'static' : 'absolute',
                            // backgroundColor: 'red',
                            width: SizeConfig.width * 40,
                            height: SizeConfig.height * 5.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: resendPress ? 'flex' : 'none',
                            // backgroundColor : 'red'
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              fontSize: SizeConfig.fontSize * 3.7,
                              color: colors.secondary,
                            }}
                          >
                            {resendTimer} Sec
                          </Text>
                        </View>
                      </View>
                      <CustomButton
                        text="Verify Otp"
                        isLoading={isLoading}
                        linearGradientStyle={styles.button}
                        linearGradientColor={[colors.success, colors.success]}
                        onPress={() => {
                          if (isConnected) {
                            onVerifyOtp();
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
    // backgroundColor : 'red'
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
  inputSection: {
    gap: SizeConfig.height * 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: SizeConfig.fontSize * 4.5,
    color: colors.color_2F3739,
  },
  subTitle: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.secondary,
  },
  button: {
    paddingVertical: SizeConfig.height * 1.5,
    borderRadius: SizeConfig.width * 3,
    alignSelf: 'center',
    width: SizeConfig.width * 40,
    borderWidth: 0,
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
  },
});

export default VerifyOtp;
