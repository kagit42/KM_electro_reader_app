import { Pressable } from 'react-native';
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
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: value ? '#4CAF50' : '#F2F6F8',
        width: SizeConfig.width * 12,
        height: SizeConfig.height * 3.8,
        borderRadius: SizeConfig.width * 10,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 2,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            width: SizeConfig.width * 6,
            height: SizeConfig.width * 6,
            borderRadius: (SizeConfig.width * 6) / 2,
            backgroundColor: value ? colors.white : colors.secondary,
          },
          thumbStyle,
        ]}
      />
    </Pressable>
  );
};

export default Switch;
