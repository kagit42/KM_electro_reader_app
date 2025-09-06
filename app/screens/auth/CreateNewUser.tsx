import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../utils/Theme';
import { SizeConfig } from '../../assets/size/size';
import CustomInput from '../../global/CustomInput';
import { useEffect, useRef, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../global/CustomButton';
import CustomDropDown from '../../global/CustomDropDown';
import { charOnlyValidate, ShowToast } from '../../utils/UtilityFunctions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationType } from '../../navigations/NavigationType';
import { useCreateUserMutation } from '../../redux/slices/authSlice';
import { useNetwork } from '../../ContextApi/NetworkProvider';

type CreateNewUserProps = NativeStackScreenProps<
  NavigationType,
  'CreateNewUser'
>;

const CreateNewUser = ({ navigation }: CreateNewUserProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [outlet, setOutlet] = useState('');
  const [region, setRegion] = useState('');
  const [channel, setChannel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const firstNameRef = useRef<TextInput>(null);
  const employeeIdRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);

  const [createUserTriger] = useCreateUserMutation();

  const { isConnected } = useNetwork();

  useEffect(() => {
    setTimeout(() => {
      firstNameRef.current?.focus();
    }, 1000);
  }, []);

  const outletOptions = [
    { label: 'Bangalore', value: 'Bangalore' },
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Mysore', value: 'Mysore' },
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Mumbai', value: 'Mumbai' },
  ];

  const regionOptions = [
    { label: 'RRSR', value: 'RRSR' },
    { label: 'MSRD', value: 'MSRD' },
    { label: 'LHB', value: 'LHB' },
  ];

  const channelOptions = [
    { label: 'NEXA', value: 'nexa' },
    { label: 'ARENA', value: 'arena' },
  ];

  const onSubmitUserDetails = async () => {
    if (firstName.length < 3) {
      ShowToast({
        title: 'Invalid First Name',
        description: 'Please enter valid name above 3 characters.',
        type: 'error',
      });
      firstNameRef.current?.focus();
      return;
    } else if (employeeId.length <= 0) {
      ShowToast({
        title: 'Invalid Employee Id',
        description: 'Please enter valid Employee Id.',
        type: 'error',
      });
      employeeIdRef.current?.focus();
      return;
    } else if (phoneNumber.length != 10) {
      ShowToast({
        title: 'Invalid Phone Number',
        description: 'Please enter valid Phone Number.',
        type: 'error',
      });
      phoneNumberRef.current?.focus();
      return;
    } else if (outlet.length <= 0) {
      ShowToast({
        title: 'Invalid Outlet Name',
        description: 'Please select the Outlet.',
        type: 'error',
      });
      return;
    } else if (region.length <= 0) {
      ShowToast({
        title: 'Invalid Region Name',
        description: 'Please select the Region.',
        type: 'error',
      });
      return;
    } else if (channel.length <= 0) {
      ShowToast({
        title: 'Invalid Channel Name',
        description: 'Please select the Channel.',
        type: 'error',
      });
      return;
    }

    try {
      setIsLoading(true);
      // let response = await createUserTriger({
      //   payload: {
      //     first_name: firstName,
      //     last_name: lastName,
      //     employee_id: employeeId,
      //     region: region,
      //     outlet: outlet,
      //     channel: channel,
      //   },
      // }).unwrap();

      console.log({
        first_name: firstName,
        last_name: lastName,
        employee_id: employeeId,
        region: region,
        outlet: outlet,
        channel: channel,
      });

      // console.log(response);
      navigation.navigate('Home');
    } catch (error) {
      console.log('Create user api failed ', error);
    } finally {
      setIsLoading(false);
    }
  };

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

          <View style={styles.formWrapper}>
            <CustomInput
              inputText={firstName}
              setInputText={(text: string) => {
                let cleaned = charOnlyValidate(text).trimStart();
                setFirstName(cleaned);
              }}
              placeholderText="First Name"
              ref={firstNameRef}
              LHSIcon={
                <MaterialIcons
                  name="person"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
            />

            <CustomInput
              inputText={lastName}
              setInputText={(text: string) => {
                let cleaned = charOnlyValidate(text).trimStart();
                setLastName(cleaned);
              }}
              placeholderText="Last Name"
              LHSIcon={
                <MaterialIcons
                  name="person-outline"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
            />

            <CustomInput
              inputText={employeeId}
              setInputText={(text: string) => {
                let cleaned = text.replace(/[^0-9]/g, '');
                setEmployeeId(cleaned);
              }}
              placeholderText="Employee ID"
              ref={employeeIdRef}
              LHSIcon={
                <MaterialIcons
                  name="badge"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
              keyboardType="numeric"
            />

            <CustomInput
              inputText={phoneNumber}
              placeholderText="Phone Number"
              setInputText={(text: string) => {
                let cleaned = text.replace(/[^0-9]/g, '');
                setPhoneNumber(cleaned);
                if (cleaned.length === 10) {
                  Keyboard.dismiss();
                }
              }}
              ref={phoneNumberRef}
              LHSIcon={
                <MaterialIcons
                  name="call"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
              keyboardType="numeric"
              maxLength={10}
            />

            <CustomDropDown
              Icon={
                <MaterialIcons
                  name="store"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
              data={outletOptions}
              setValue={setOutlet}
              value={outlet}
              placeholder="Select Outlet"
            />

            <CustomDropDown
              Icon={
                <MaterialIcons
                  name="public"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
              data={regionOptions}
              value={region}
              setValue={setRegion}
              placeholder="Select Region"
            />

            <CustomDropDown
              Icon={
                <MaterialIcons
                  name="work"
                  size={SizeConfig.width * 4.5}
                  color={colors.secondary}
                />
              }
              data={channelOptions}
              value={channel}
              setValue={setChannel}
              placeholder="Select Channel"
            />
          </View>

          <CustomButton
            text="Create Profile"
            linearGradientStyle={styles.button}
            linearGradientColor={[colors.primary, colors.secPrimary]}
            isLoading={isLoading}
            onPress={() => {
              if (isConnected) {
                onSubmitUserDetails();
              } else {
                ShowToast({
                  title: 'No Service Provider',
                  description: 'No Internet connection found !',
                  type: 'error',
                });
              }
            }}
          />
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
    width: '100%',
    alignSelf: 'center',
    borderWidth: 0,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 5,
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
