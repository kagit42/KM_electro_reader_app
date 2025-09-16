import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import { NavigationType } from '../../navigations/NavigationType';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useGetProfileDataMutation } from '../../redux/slices/profileSlice';
import * as Keychain from 'react-native-keychain';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { ShowToast } from '../../utils/UtilityFunctions';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

type SplashScreenProps = NativeStackScreenProps<NavigationType, 'SplashScreen'>;

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');

  let titleString = 'Kalyani Motors';
  let subTitleString = 'Track & Save Energy';
  let count = 1;

  const [getProfileDataTrigger] = useGetProfileDataMutation();

  const { isConnected } = useNetwork();

  const translateY = useSharedValue(-400);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const titleSlice = () => {
    let unSubscript = setInterval(() => {
      setTitle(titleString.slice(0, count));
      count = count + 1;

      console.log(count);

      if (count == 15) {
        clearInterval(unSubscript);
        count = 0;
      }
    }, 100);
  };

  const subTitleSlice = () => {
    let unSubscript = setInterval(() => {
      setSubTitle(subTitleString.slice(0, count));
      count = count + 1;
      if (count == 20) {
        clearInterval(unSubscript);
      }
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      setTitle('K');
    }, 4500);
    setTimeout(() => {
      titleSlice();
    }, 5000);

    setTimeout(() => {
      subTitleSlice();
    }, 7000);
  }, []);

  useEffect(() => {
    (opacity.value = withTiming(1, { duration: 4000 })),
      (translateY.value = withRepeat(
        withSequence(
          withTiming(50, { duration: 2000 }),
          withTiming(0, { duration: 1500 }),
        ),
        1,
        true,
      ));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 2000 }),
          withTiming(1, { duration: 2000 }),
        ),
        -1,
        true,
      );
    }, 3000);
  }, [scale]);

  const breathingEffect = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkUserExist = async () => {
    try {
      const checkAccessToken = await Keychain.getGenericPassword({
        service: 'verifyOtp_service',
      });

      if (!checkAccessToken) {
        navigation.replace('SendOtp');
        return;
      }

      let convertToString: any = {};
      try {
        convertToString = JSON.parse(checkAccessToken.password || '{}');
      } catch {
        convertToString = {};
      }
      console.log(convertToString);
      if (convertToString?.access_token && convertToString?.is_registered) {
        navigation.replace('Home');
      } else {
        navigation.replace('SendOtp');
      }
    } catch (error: any) {
      console.log(error);
      if (error?.code == 'token_not_valid') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SendOtp' }],
        });
      } else {
        setTimeout(() => {
          navigation.navigate('NetworkIssueScreen');
        }, 5000);
        ShowToast({
          title: 'Something Went Wrong',
          description: 'It may cause due to unstable internet !',
          type: 'error',
        });
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        checkUserExist();
      }, 10000);
    } else {
      ShowToast({
        title: 'No Service Provider',
        description: 'No Internet connection found !',
        type: 'error',
      });

      setTimeout(() => {
        navigation.navigate('NetworkIssueScreen');
      }, 5000);
    }
  }, [isConnected]);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (!remoteMessage) {
          return;
        }
        navigation.navigate('DetailScreen', {
          data: {
            channel: '',
            image_url: '',
            meter_reading: '',
            outlet: '',
            region: '',
            serial_number: '',
            status: false,
            verify_time: '',
            timestamp: '',
          },
        });
      });
  }, []);

  return (
    <>
      {isConnected ? (
        <LinearGradient
          colors={[colors.primary, colors.secPrimary]}
          start={{ x: 0.4, y: 1 }}
          end={{ x: 0.1, y: 0.1 }}
          style={{
            flex: 1,
          }}
        >
          <SafeAreaView
            style={{
              flex: 1,
            }}
            edges={['top']}
          >
            <StatusBar
              backgroundColor={colors.secPrimary}
              barStyle="light-content"
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={styles.splashComp}>
                <Animated.Image
                  source={require('../../assets/images/auth/splashLogo.png')}
                  style={[styles.splashImg, breathingEffect]}
                />

                <View style={{ gap: SizeConfig.width }}>
                  <Text style={styles.splashTitle}>{title}</Text>
                  <Text style={styles.splashSubTitle}>{subTitle}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      ) : (
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
              source={require('../../assets/images/auth/noInternet.png')}
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  splashImg: {
    width: SizeConfig.width * 19,
    height: SizeConfig.width * 19,
    resizeMode: 'contain',
  },
  splashComp: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SizeConfig.height * 2,
  },
  splashTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 6,
    color: colors.white,
    textAlign: 'center',
  },
  splashSubTitle: {
    fontFamily: fonts.light,
    fontSize: SizeConfig.fontSize * 3.4,
    color: colors.white,
    textAlign: 'center',
  },
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
  animatedLogoComp: {
    width: SizeConfig.width * 16,
    height: SizeConfig.width * 16,
    backgroundColor: colors.white,
    borderRadius: (SizeConfig.width * 16) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;
