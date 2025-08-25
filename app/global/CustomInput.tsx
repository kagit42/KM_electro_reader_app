import React, { ReactNode } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  KeyboardTypeOptions,
} from 'react-native';
import { SizeConfig } from '../assets/size/size';
import { colors, fonts } from '../utils/Theme';

interface CustomInputProps {
  inputText: string;
  setInputText: (value: string) => void;
  onRHSPress?: () => void;
  placeholderText: string;
  placeholderTextColor?: string;
  LHSIcon?: ReactNode;
  RHSIcon?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputText,
  setInputText,
  onRHSPress,
  placeholderText = 'Type here !',
  placeholderTextColor = colors.color_4C5F66,
  LHSIcon,
  RHSIcon,
  keyboardType = 'default',
  maxLength = 15,
}) => {
  return (
    <View style={styles.container}>
      {LHSIcon && <Pressable style={styles.iconWrapper}>{LHSIcon}</Pressable>}

      <TextInput
        value={inputText}
        placeholder={placeholderText}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setInputText}
        style={styles.input}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />

      {RHSIcon && (
        <TouchableOpacity onPress={onRHSPress} style={styles.iconWrapper}>
          {RHSIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(194, 190, 190, 1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.color_E7E3E0,
    borderBottomWidth: SizeConfig.width * 0.3,
  },
  iconWrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: SizeConfig.width * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.white,
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.color_4C5F66,
  },
});

export default CustomInput;
