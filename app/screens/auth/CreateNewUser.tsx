import { StatusBar, Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomInput from '../../global/CustomInput';
import { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../global/CustomButton';

const CreateNewUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [outlet, setOutlet] = useState('');
  const [region, setRegion] = useState('');
  const [channel, setChannel] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.innerContent}>
          <View>
            <Text style={styles.title}>Get Started with Registration</Text>
            <Text style={styles.subtitle}>
              Create your account to unlock all features and enjoy a seamless
              experience with our application.
            </Text>
          </View>

          <View
            style={{
              gap: SizeConfig.height * 4.5,
            }}
          >
            <View style={styles.formWrapper}>
              <CustomInput
                inputText={firstName}
                setInputText={setFirstName}
                placeholderText="First Name"
                LHSIcon={
                  <MaterialIcons
                    name="person"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
              />

              <CustomInput
                inputText={lastName}
                setInputText={setLastName}
                placeholderText="Last Name"
                LHSIcon={
                  <MaterialIcons
                    name="person-outline"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
              />

              <CustomInput
                inputText={employeeId}
                setInputText={setEmployeeId}
                placeholderText="Employee ID"
                LHSIcon={
                  <MaterialIcons
                    name="badge"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
                keyboardType="numeric"
              />

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

              <CustomInput
                inputText={outlet}
                setInputText={setOutlet}
                placeholderText="Outlet"
                LHSIcon={
                  <MaterialIcons
                    name="store"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
              />

              <CustomInput
                inputText={region}
                setInputText={setRegion}
                placeholderText="Region"
                LHSIcon={
                  <MaterialIcons
                    name="public"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
              />

              <CustomInput
                inputText={channel}
                setInputText={setChannel}
                placeholderText="Channel"
                LHSIcon={
                  <MaterialIcons
                    name="work"
                    size={SizeConfig.width * 4.5}
                    color={colors.color_4C5F66}
                  />
                }
              />
            </View>

            <CustomButton
              text="Register User"
              linearGradientStyle={styles.button}
              linearGradientColor={[colors.success, colors.success]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  innerContent: {
    flex: 1,
    paddingTop: SizeConfig.height * 5,
    paddingHorizontal: SizeConfig.width * 6,
    gap: SizeConfig.height * 3,
  },
  formWrapper: {
    gap: SizeConfig.height * 3.5,
  },
  button: {
    paddingVertical: SizeConfig.height * 1.7,
    width: '80%',
    borderRadius: SizeConfig.width * 6,
    alignSelf: 'center',
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 4.4,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.secondary,
    textAlign: 'center',
  },
});

export default CreateNewUser;
