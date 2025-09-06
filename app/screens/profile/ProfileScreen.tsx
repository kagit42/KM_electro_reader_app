import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SizeConfig } from '../../assets/size/size';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts } from '../../utils/Theme';
import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import appVersion from '../../../app.json';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ShowToast } from '../../utils/UtilityFunctions';
import { NavigationType } from '../../navigations/NavigationType';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const handleLogout = ({ navigation }: any) => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await removeKeychainsLogout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'SendOtp' }],
          });
        },
      },
    ],
    { cancelable: true },
  );
};

const removeKeychainsLogout = async () => {
  console.log('Key chain is Cleared !!! ');

  try {
    await Keychain.resetGenericPassword({
      service: 'verifyOtp_service',
    });
    await Keychain.resetGenericPassword({
      service: 'otp_section',
    });
    await Keychain.resetGenericPassword({
      service: 'profileData_service',
    });
    await Keychain.resetGenericPassword({
      service: 'sendOtpObj',
    });
  } catch (error) {
    console.log(error);

    ShowToast({
      title: 'Something Went Wrong',
      description: `Something went wrong while performing Logout.`,
      type: 'error',
    });
  }
};

type UserDataTypes = {
  channel: string;
  employee_id: string;
  first_name: string;
  is_registered: boolean;
  last_name: string;
  mobile_number: string;
  outlet: string;
  region: string;
};

type ProfileProps = NativeStackScreenProps<NavigationType, 'ProfileScreen'>;

const ProfileScreen = ({ navigation }: ProfileProps) => {
  const [userData, setUserData] = useState<UserDataTypes>({
    channel: '',
    employee_id: '',
    first_name: '',
    is_registered: false,
    last_name: '',
    mobile_number: '',
    outlet: '',
    region: '',
  });

  const getProfileDataLocal = async () => {
    const getProfileDataObj = await Keychain.getGenericPassword({
      service: 'profileData_service',
    });

    console.log(getProfileDataObj);

    if (getProfileDataObj) {
      let convertToString: any = {};
      try {
        convertToString = JSON.parse(getProfileDataObj.password || '{}');
        setUserData(convertToString);
      } catch {
        convertToString = {};
      }
    }
  };

  useEffect(() => {
    getProfileDataLocal();
  }, []);

  return (
    <SafeAreaView style={styles.drawerContentContainer}>
      <StatusBar backgroundColor={'#3D4E6B'} barStyle={'light-content'} />
      <LinearGradient
        colors={['#3D4E6B', '#0B2044']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingHorizontal: SizeConfig.width * 6,
          paddingVertical: SizeConfig.height * 3,
          gap: SizeConfig.height * 2,
          borderWidth: 0,
          borderColor: '#E5E7EB',
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.headerBackBtnComp}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require('../../assets/images/profile/backArrow.png')}
              style={{
                width: SizeConfig.width * 5,
                height: SizeConfig.width * 5,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.userInfoSection}>
          <View>
            <Text style={styles.userName}>
              {userData.first_name + userData.last_name || 'Sourav CM'}
            </Text>
            <Text style={styles.userContact}>
              {/* {userData.mobile_number ?? '--'} */}
              +91 70220 99005
            </Text>
            <Text style={styles.userContact}>
              {/* {userData.region ?? 'RRSR'} */}
              Primemin@india.com
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#FFF7E4',
              width: SizeConfig.width * 18,
              height: SizeConfig.width * 18,
              borderRadius: (SizeConfig.width * 18) / 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: SizeConfig.fontSize * 15.5,
                color: '#795730',
                fontFamily: fonts.semiBold,
                bottom: SizeConfig.width * 3,
              }}
            >
              A
            </Text>
          </View>

          {/* <Image
            source={require('../../assets/images/home/avatar.png')}
            style={styles.avatar}
          /> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SizeConfig.width * 3,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: SizeConfig.width,
            }}
          >
            <Image
              source={require('../../assets/images/profile/user.png')}
              style={{
                width: SizeConfig.width * 4,
                height: SizeConfig.width * 4,
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.userContact}>81223</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: SizeConfig.width * 0.5,
            }}
          >
            <Image
              source={require('../../assets/images/profile/medal.png')}
              style={{
                width: SizeConfig.width * 4,
                height: SizeConfig.width * 4,
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.userContact}>Arena</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ backgroundColor: colors.primary }}>
        <View
          style={{
            paddingHorizontal: SizeConfig.width * 4,
            backgroundColor: '#F9FAFB',
            height: '100%',
            borderTopLeftRadius: SizeConfig.width * 7,
            borderTopRightRadius: SizeConfig.width * 7,
            paddingTop: SizeConfig.height * 3.5,
            gap: SizeConfig.height * 3,
          }}
        >
          <View
            style={{
              gap: SizeConfig.height * 1.5,
              backgroundColor: colors.white,
              paddingHorizontal: SizeConfig.width * 2,
              paddingVertical: SizeConfig.height * 1.7,
              borderRadius: SizeConfig.width * 3,
              //   borderWidth: 0.5,
              //   borderColor: colors.border,
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: SizeConfig.width * 3,
                paddingHorizontal: SizeConfig.width * 1.5,
                paddingVertical: SizeConfig.width * 1.5,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: SizeConfig.fontSize * 3,
                  color: '#555555',
                  fontFamily: fonts.regular,
                }}
              >
                Location
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //   justifyContent: 'center',
                  gap: SizeConfig.width * 2,
                }}
              >
                <Image
                  source={require('../../assets/images/profile/location.png')}
                  style={{
                    width: SizeConfig.width * 4,
                    height: SizeConfig.width * 4,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontSize: SizeConfig.fontSize * 3.4,
                    color: colors.pureBlack,
                    fontFamily: fonts.medium,
                  }}
                >
                  Bangalore
                </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: SizeConfig.width * 3,
                paddingHorizontal: SizeConfig.width * 1.5,
                paddingVertical: SizeConfig.width * 1.5,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: SizeConfig.fontSize * 3,
                  color: '#555555',
                  fontFamily: fonts.regular,
                }}
              >
                Outlet
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //   justifyContent: 'center',
                  gap: SizeConfig.width * 2,
                }}
              >
                <Image
                  source={require('../../assets/images/profile/buildings.png')}
                  style={{
                    width: SizeConfig.width * 4,
                    height: SizeConfig.width * 4,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontSize: SizeConfig.fontSize * 3.4,
                    color: colors.pureBlack,
                    fontFamily: fonts.medium,
                  }}
                >
                  MSRD
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              gap: SizeConfig.height * 1.5,
              backgroundColor: colors.white,
              paddingHorizontal: SizeConfig.width * 2,
              paddingVertical: SizeConfig.height,
              borderRadius: SizeConfig.width * 3,
              //   borderWidth: 0.5,
              //   borderColor: colors.border,
            }}
          >
            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                getProfileDataLocal();
                navigation.navigate('ViewAllHistory');
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: SizeConfig.width * 2,
                }}
              >
                <Image
                  source={require('../../assets/images/profile/history.png')}
                  style={{
                    width: SizeConfig.width * 5,
                    height: SizeConfig.width * 5,
                    resizeMode: 'contain',
                  }}
                />
                <Text style={[styles.menuItemText]}>View All History</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={SizeConfig.width * 5.4}
                color={colors.pureBlack}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                getProfileDataLocal();
                navigation.navigate('Settings');
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: SizeConfig.width * 2,
                }}
              >
                <Image
                  source={require('../../assets/images/profile/settings.png')}
                  style={{
                    width: SizeConfig.width * 5,
                    height: SizeConfig.width * 5,
                    resizeMode: 'contain',
                  }}
                />
                <Text style={[styles.menuItemText]}>Settings</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={SizeConfig.width * 5.4}
                color={colors.pureBlack}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                navigation.navigate('AboutScreen');
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: SizeConfig.width * 2,
                }}
              >
                <Image
                  source={require('../../assets/images/profile/information.png')}
                  style={{
                    width: SizeConfig.width * 5,
                    height: SizeConfig.width * 5,
                    resizeMode: 'contain',
                  }}
                />
                <Text style={[styles.menuItemText]}>About Us</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={SizeConfig.width * 5.4}
                color={colors.pureBlack}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                handleLogout({ navigation: navigation });
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: SizeConfig.width * 2,
                }}
              >
                <Image
                  source={require('../../assets/images/profile/logout.png')}
                  style={{
                    width: SizeConfig.width * 5,
                    height: SizeConfig.width * 5,
                    resizeMode: 'contain',
                  }}
                />
                <Text style={[styles.menuItemText]}>Logout</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={SizeConfig.width * 5.4}
                color={colors.pureBlack}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.versionText}>
              App Version {appVersion.version}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContentContainer: {
    flex: 1,
    backgroundColor: '#3D4E6B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: SizeConfig.width * 4,
  },
  headerBackBtnComp: {
    backgroundColor: colors.white,
    width: SizeConfig.width * 8,
    height: SizeConfig.width * 8,
    borderRadius: (SizeConfig.width * 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.regular,
    fontSize: SizeConfig.fontSize * 5.5,
    color: colors.white,
    width: '100%',
  },
  userInfoSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SizeConfig.height * 2,
  },
  avatar: {
    width: SizeConfig.width * 20,
    height: SizeConfig.width * 20,
    borderRadius: SizeConfig.width * 14,
    // marginBottom: SizeConfig.width * 2.5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userName: {
    fontSize: SizeConfig.fontSize * 5.5,
    color: colors.white,
    fontFamily: fonts.medium,
  },
  userContact: {
    fontSize: SizeConfig.fontSize * 3.4,
    color: colors.white,
    fontFamily: fonts.light,
  },
  divider: {
    width: '90%',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    alignSelf: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SizeConfig.width * 1.5,
    paddingHorizontal: SizeConfig.width * 2.1,
    borderRadius: SizeConfig.width * 2.1,
    backgroundColor: colors.white,
    gap: SizeConfig.width * 2,
  },
  activeMenuItem: {
    backgroundColor: `${colors.primary}20`,
  },
  menuItemText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.pureBlack,
    // flex: 1,
  },
  activeMenuItemText: {
    color: colors.primary,
  },
  badge: {
    minWidth: SizeConfig.width * 4.5,
    height: SizeConfig.width * 4.5,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    borderRadius: SizeConfig.width * 2.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: SizeConfig.width * 2.5,
  },
  footerSection: {
    position: 'absolute',
    bottom: SizeConfig.height * 33,
    left: 0,
    right: 0,
  },
  versionText: {
    fontSize: SizeConfig.width * 2.9,
    fontFamily: fonts.medium,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: SizeConfig.width * 2.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: SizeConfig.width * 2.5,
    borderRadius: SizeConfig.width * 2.5,
  },
  logoutText: {
    color: colors.white,
    fontSize: SizeConfig.width * 3.7,
    fontWeight: '700',
    marginRight: SizeConfig.width * 2.5,
  },
});

export default ProfileScreen;
