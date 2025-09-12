import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Keyboard } from 'react-native';
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { colors, fonts } from '../../../utils/Theme';
import { SizeConfig } from '../../../assets/size/size';

const CELL_COUNT = 6;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onTextFilled: (value: string) => void;
  autoFocus?: boolean;
}

const OTPTextInput = ({
  value,
  onChange,
  onTextFilled,
  autoFocus = false,
}: Props) => {
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: newValue => {
      const numericValue = newValue.replace(/[^0-9]/g, '');
      onChange(numericValue);
      if (numericValue.length === CELL_COUNT) {
        onTextFilled(numericValue);
      }
    },
  });

  useEffect(() => {
    if (value && value.length === CELL_COUNT) {
      onTextFilled(value);
      Keyboard.dismiss();
    }
  }, [value]);

  return (
    <SafeAreaView>
      <CodeField
        {...codeFieldProps}
        value={value}
        onChangeText={(text: string) => {
          const numericText = text.replace(/[^0-9]/g, '');
          onChange(numericText);
          if (numericText.length === CELL_COUNT) {
            onTextFilled(numericText);
            Keyboard.dismiss();
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={{ marginVertical: SizeConfig.height * 2 }}
        keyboardType="number-pad"
        textContentType={'oneTimeCode'}
        autoFocus={autoFocus}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OTPTextInput;

const styles = StyleSheet.create({
  cellRoot: {
    width: SizeConfig.width * 12,
    height: SizeConfig.height * 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D7D6D6',
    borderWidth: 1,
    borderRadius: SizeConfig.width * 3,
    marginHorizontal: SizeConfig.width,
    backgroundColor: colors.white,
  },
  cellText: {
    color: colors.pureBlack,
    fontSize: SizeConfig.fontSize * 5,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#233f78da',
    borderWidth: SizeConfig.width * 0.3,
    borderRadius: SizeConfig.width * 3,
    shadowColor: '#233f78da',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0.4,
    elevation: 4,
    backgroundColor: colors.white,
  },
});
