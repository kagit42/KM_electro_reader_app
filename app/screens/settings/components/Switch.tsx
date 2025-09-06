import { Pressable, StyleSheet } from 'react-native';
import { SizeConfig } from '../../../assets/size/size';
import { colors } from '../../../utils/Theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const Switch = ({
  onPress,
  value,
}: {
  onPress: () => void;
  value: boolean;
}) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(value ? 18 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.switchComp}>
      <Animated.View
        style={[
          {
            width: SizeConfig.width * 5.3,
            height: SizeConfig.width * 5.3,
            borderRadius: (SizeConfig.width * 6) / 2,
            backgroundColor: value ? colors.primary : '#0B204480',
          },
          thumbStyle,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchComp: {
    backgroundColor: '#E5E7EB',
    width: SizeConfig.width * 11,
    height: SizeConfig.height * 3.3,
    borderRadius: SizeConfig.width * 10,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
});

export default Switch;
