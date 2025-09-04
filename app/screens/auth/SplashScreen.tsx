import { Image, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../utils/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SizeConfig } from '../../assets/size/size';
import { NavigationType } from '../../navigations/NavigationType';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useGetProfileDataMutation } from '../../redux/slices/profileSlice';
import * as Keychain from 'react-native-keychain';
import { useNetwork } from '../../ContextApi/NetworkProvider';
import { ShowToast } from '../../utils/UtilityFunctions';

type SplashScreenProps = NativeStackScreenProps<NavigationType, 'SplashScreen'>;

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  const [getProfileDataTrigger] = useGetProfileDataMutation();

  const { isConnected } = useNetwork();

  const checkUserExist = async () => {
    try {
      const sendOtpObject = await Keychain.getGenericPassword({
        service: 'otp_section',
      });

      if (!sendOtpObject) {
        navigation.replace('SendOtp');
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
      checkUserExist();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#49b02dff' }}>
      <StatusBar backgroundColor={'#49b02dff'} barStyle="light-content" />
      <LinearGradient
        colors={[colors.primary, '#49b02d99']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0.1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Image
          source={require('../../assets/images/auth/splashLogo.png')}
          style={styles.splashImg}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splashImg: {
    width: '100%',
    height: SizeConfig.height * 9,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
