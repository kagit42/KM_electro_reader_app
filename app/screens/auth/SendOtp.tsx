import { Image, StatusBar, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomInput from '../../global/CustomInput';
import { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../global/CustomButton';

const SendOtp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#F2F6F8'} barStyle="dark-content" />

      {/* Top Banner Section */}
      <View style={styles.bannerWrapper}>
        <Image
          source={require('../../assets/images/auth/authBanner.png')}
          style={styles.bannerImage}
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentWrapper}>
        <View style={styles.innerContent}>
          {/* Title & Input */}
          <View style={styles.inputSection}>
            <Text style={styles.title}>Log In</Text>

            <View
              style={{
                gap: SizeConfig.height * 4,
              }}
            >
              <CustomInput
                inputText={phoneNumber}
                setInputText={setPhoneNumber}
                placeholderText="Phone Number"
                LHSIcon={
                  <MaterialIcons
                    name="call"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
                keyboardType="numeric"
                maxLength={10}
              />

              <CustomButton
                text="Send Otp"
                linearGradientStyle={styles.button}
                linearGradientColor={[colors.success, colors.success]}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.policyText}>
              By continuing, you agree to our Policy.
            </Text>
            <Text style={styles.linkText}>Terms & Conditions and Privacy</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bannerWrapper: {
    backgroundColor: '#F2F6F8',
    height: SizeConfig.height * 35,
  },
  bannerImage: {
    width: SizeConfig.width * 100,
    height: SizeConfig.height * 40,
    resizeMode: 'stretch',
    position: 'absolute',
    top: 0,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F2F6F8',
  },
  innerContent: {
    flex: 1,
    borderTopRightRadius: SizeConfig.width * 8,
    borderTopLeftRadius: SizeConfig.width * 8,
    paddingTop: SizeConfig.height * 5,
    paddingHorizontal: SizeConfig.width * 6,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  inputSection: {
    gap: SizeConfig.height * 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: SizeConfig.fontSize * 4.5,
    color: colors.color_2F3739,
    marginBottom: SizeConfig.height * 3,
  },
  button: {
    paddingVertical: SizeConfig.height * 1.7,
    width: '80%',
    borderRadius: SizeConfig.width * 5,
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SizeConfig.height * 5,
  },
  policyText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.2,
    color: colors.black,
  },
  linkText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.primary,
    textDecorationLine: 'underline',
    // marginTop: SizeConfig.height * 1,
  },
});

export default SendOtp;
