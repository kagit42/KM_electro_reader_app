import { Image, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../utils/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SizeConfig } from '../../assets/size/size';

const SplashScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={'#49b02d99'} barStyle="light-content" />
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
