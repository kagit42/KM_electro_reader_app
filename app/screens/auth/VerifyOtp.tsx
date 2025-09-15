import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomButton from '../../global/CustomButton';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import OTPTextInput from './components/OTPTextInput';

type VerifyOtpProps = NativeStackScreenProps<NavigationType, 'VerifyOtp'>;

const VerifyOtp = ({ navigation, route }: VerifyOtpProps) => {
  const [otp, setOtp] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendPress, setResendPress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
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

  const handleOTPChange = (otp: string) => {
    setOtp(otp);
  };

  const handleOtpFilled = (otp: string) => {
    if (otp.length === 6) {
      Keyboard.dismiss();
    }
  };

  // Auto OTP Filling

  const SMSRetrived = NativeModules.SMSRetrived;
  useEffect(() => {
    setupMsgListener();
    return () => {
      DeviceEventEmitter.removeAllListeners('SMS_CONSTANT_EVENT');
    };
  }, [resendPress]);

  const setupMsgListener = async () => {
    try {
      if (Platform.OS == 'android') {
        const getSMSMessage = await SMSRetrived.checkUpdate();
        DeviceEventEmitter.addListener('SMS_CONSTANT_EVENT', listenOtp);
        console.log(getSMSMessage);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listenOtp = (data: any) => {
    if (data && data.receivedOtpMessage != null) {
      var msg = data.receivedOtpMessage;
      var code = (msg.match(/\d{6}/) || [false])[0];
      console.log(code);
      setOtp(code);
    }
  };

  useEffect(() => {
    if (otp.length == 6) {
      onVerifyOtp();
    }
  }, [otp]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: SizeConfig.width * 6,
              paddingTop: SizeConfig.height * 7,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputSection}>
              <View
                style={{
                  gap: SizeConfig.height,
                }}
              >
                <View>
                  <Text style={styles.title}>Verify OTP</Text>
                  <Text style={styles.subTitle}>
                    We’ve sent a 6-digit code to your phone
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.editPhoneNoText}
                    onPress={() => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'SendOtp' }],
                      });
                    }}
                  >
                    <Text
                      style={[styles.subTitle, { fontFamily: fonts.medium }]}
                    >
                      +91 {mobile_number || '1234567890'}
                    </Text>
                    <AntDesign
                      name="edit"
                      size={SizeConfig.width * 4}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  gap: SizeConfig.height * 4,
                }}
              >
                <OTPTextInput
                  value={otp}
                  onChange={handleOTPChange}
                  onTextFilled={handleOtpFilled}
                  autoFocus={true}
                />

                <View style={styles.buttonMainComp}>
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
                      style={[
                        styles.reSendTimer,
                        {
                          position: resendPress ? 'static' : 'absolute',
                          display: resendPress ? 'flex' : 'none',
                        },
                      ]}
                    >
                      <Text style={styles.reSendTimerText}>
                        {resendTimer} Sec
                      </Text>
                    </View>
                  </View>
                  <CustomButton
                    text="Verify OTP"
                    isLoading={isLoading}
                    linearGradientStyle={styles.button}
                    linearGradientColor={[colors.primary, colors.secPrimary]}
                    onPress={() => {
                      if (isConnected) {
                        if (!isLoading) {
                          onVerifyOtp();
                        }
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
    backgroundColor: colors.white,
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
  inputSection: {
    gap: SizeConfig.height * 4,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 5.5,
    color: colors.color_2F3739,
  },
  subTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.secondary,
  },
  button: {
    paddingVertical: SizeConfig.height * 1.5,
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
  editPhoneNoText: {
    flexDirection: 'row',
    gap: SizeConfig.width,
    alignItems: 'center',
  },
  buttonMainComp: {
    flexDirection: 'row',
    gap: SizeConfig.width * 2,
    justifyContent: 'space-evenly',
  },
  reSendTimer: {
    width: SizeConfig.width * 40,
    height: SizeConfig.height * 5.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reSendTimerText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.secondary,
  },
});

export default VerifyOtp;
