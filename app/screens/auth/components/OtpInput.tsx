import { OtpInput, OtpInputProps, OtpInputRef } from 'react-native-otp-entry';
import { colors } from '../../../utils/Theme';
import { Keyboard } from 'react-native';
import { SizeConfig } from '../../../assets/size/size';
import { RefObject } from 'react';

const CustomOtpInput = ({
  setOtp,
  otpRef,
}: {
  setOtp: (props: string) => void;
  otpRef: RefObject<OtpInputRef | null>;
}) => {
  return (
    <OtpInput
      numberOfDigits={6}
      focusColor={colors.secPrimary}
      placeholder="******"
      disabled={false}
      ref={otpRef}
      type="numeric"
      secureTextEntry={false}
      focusStickBlinkingDuration={500}
      onTextChange={text => setOtp(text)}
      onFilled={text => {
        setOtp(text);
        Keyboard.dismiss();
      }}
      textProps={{
        allowFontScaling: false,
      }}
      theme={{
        containerStyle: {
          justifyContent: 'space-between',
        },
        pinCodeContainerStyle: {
          width: SizeConfig.width * 13,
          height: SizeConfig.width * 14,
          borderRadius: SizeConfig.width * 3,
          borderWidth: 1,
          borderColor: colors.border,
        },
        pinCodeTextStyle: {
          fontSize: SizeConfig.fontSize * 5,
          color: colors.black,
        },
      }}
    />
  );
};

export default CustomOtpInput;
