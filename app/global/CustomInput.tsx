import React, { ReactNode, Ref } from 'react';
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
  onChange?: () => void;
  ref?: Ref<TextInput>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputText,
  setInputText,
  onRHSPress,
  placeholderText = 'Type here !',
  placeholderTextColor = colors.secondary,
  LHSIcon,
  RHSIcon,
  keyboardType = 'default',
  maxLength = 15,
  onChange,
  ref,
}) => {
  return (
    <View style={styles.container}>
      {LHSIcon && <Pressable style={styles.iconWrapper}>{LHSIcon}</Pressable>}

      <TextInput
        value={inputText}
        placeholder={placeholderText}
        ref={ref}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setInputText}
        style={styles.input}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChange={onChange}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth : 1,
    borderRadius : SizeConfig.width * 3,
    padding : SizeConfig.width,
    borderColor : colors.border
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
