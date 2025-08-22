import { Image, StatusBar, View } from 'react-native';
import { colors } from '../../util/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SizeConfig } from '../../assets/size/size';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const SplashScreen = () => {
  // Shared value for scale
  const scale = useSharedValue(1);

  useEffect(() => {
    // Start breathing effect
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), // zoom in
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })   // zoom out
      ),
      -1, 
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} barStyle={'light-content'} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.Image
          source={require('../../assets/images/global/kalyani_dark.png')}
          style={[
            {
              width: SizeConfig.width * 40,
              height: SizeConfig.width * 20,
              resizeMode: 'contain',
            },
            animatedStyle,
          ]}
        />

      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
