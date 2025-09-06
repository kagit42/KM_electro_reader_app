import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../utils/Theme';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SizeConfig } from '../assets/size/size';
import { ReactNode } from 'react';

const CustomButton = ({
  text,
  linearGradientStyle,
  linearGradientColor = [colors.primary, '#49b02d99'],
  LHSIcon,
  RHSIcon,
  TextStyle,
  onPress,
  isLoading,
}: {
  text: string;
  TextStyle?: TextStyle;
  linearGradientColor?: [string, string];
  linearGradientStyle?: ViewStyle | [ViewStyle, {}];
  LHSIcon?: ReactNode;
  RHSIcon?: ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <LinearGradient
        colors={linearGradientColor}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[styles.viewDetailComp, linearGradientStyle]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Pressable style={styles.touchableOpacityStyle} onPress={onPress}>
            {LHSIcon}
            <Text style={[styles.viewDetailText, TextStyle]}>{text}</Text>
            {RHSIcon}
          </Pressable>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewDetailText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.white,
  },
  viewDetailComp: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: colors.success,
    borderRadius: SizeConfig.width * 2,
    // borderWidth: 0.5,
  },
  touchableOpacityStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SizeConfig.width * 2,
  },
});

export default CustomButton;
