import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import { NavigationType } from '../../navigations/NavigationType';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
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

type SplashScreenProps = NativeStackScreenProps<NavigationType, 'SplashScreen'>;

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  const [getProfileDataTrigger] = useGetProfileDataMutation();

  const { isConnected } = useNetwork();

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, [scale]);

  const breathingEffect = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkUserExist = async () => {
    try {
      const sendOtpObject = await Keychain.getGenericPassword({
        service: 'otp_section',
      });

      if (!sendOtpObject) {
        // navigation.replace('SendOtp');
        return;
      }

      let convertToString: any = {};
      try {
        convertToString = JSON.parse(sendOtpObject.password || '{}');
      } catch {
        convertToString = {};
      }

      if (convertToString?.mobile_number) {
        const response = await getProfileDataTrigger({
          mobileNumber: convertToString.mobile_number,
        }).unwrap();

        if (response?.user_data) {
          navigation.replace('DrawerNavigation');
        } else {
          navigation.replace('SendOtp');
        }
      } else {
        navigation.replace('SendOtp');
      }
    } catch (error) {
      console.log(error);
      navigation.replace('SendOtp');
    }
  };

  useEffect(() => {
    if (isConnected) {
      // checkUserExist();
      setTimeout(() => {
        navigation.replace('SendOtp');
      }, 4000);
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

  return (
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
          // translucent={Number(Platform.Version) >= 35 ? true : false}
          backgroundColor={colors.secPrimary}
          barStyle="light-content"
        />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.splashComp}>
            <Animated.Image
              source={require('../../assets/images/auth/splashLogo.png')}
              style={[styles.splashImg, breathingEffect]}
            />

            <View style={{ gap: SizeConfig.width }}>
              <Text style={styles.splashTitle}>Kalyani Motors</Text>
              <Text style={styles.splashSubTitle}>Track & Save Energy</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
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
});

export default SplashScreen;
