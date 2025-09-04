import {
  DrawerContentScrollView,
  useDrawerStatus,
} from '@react-navigation/drawer';
import {
  Alert,
  Image,
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationType } from '../NavigationType';
import { ShowToast } from '../../utils/UtilityFunctions';

type NavigationProp = NativeStackNavigationProp<NavigationType>;
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

const CustomDrawerUi = (props: any) => {
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

  let navigation = useNavigation<NavigationProp>();
  const isDrawerOpen = useDrawerStatus();

  const currentRoute = props.state.routeNames[props.state.index];
  const isActive = (routeName: string) => currentRoute === routeName;

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
  }, [isDrawerOpen]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContentContainer}
    >
      <View style={styles.userInfoSection}>
        <Image
          source={require('../../assets/images/home/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>
          {userData.first_name + userData.last_name || '--'}
        </Text>
        <Text style={styles.userContact}>{userData.mobile_number ?? '--'}</Text>
        <Text style={styles.userContact}>{userData.region ?? '--'}</Text>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[
          styles.menuItem,
          isActive('HomeStack') && styles.activeMenuItem,
        ]}
        onPress={() => {
          getProfileDataLocal();
          props.navigation.navigate('Home');
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="home"
          size={SizeConfig.width * 5}
          color={isActive('Home') ? colors.primary : colors.black}
        />
        <Text
          style={[
            styles.menuItemText,
            isActive('Home') && styles.activeMenuItemText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          isActive('ViewAllHistory') && styles.activeMenuItem,
        ]}
        onPress={() => {
          getProfileDataLocal();
          props.navigation.navigate('ViewAllHistory');
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="history"
          size={SizeConfig.width * 5}
          color={isActive('Requests') ? colors.primary : colors.black}
        />
        <Text
          style={[
            styles.menuItemText,
            isActive('Requests') && styles.activeMenuItemText,
          ]}
        >
          View All History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, isActive('Settings') && styles.activeMenuItem]}
        onPress={() => {
          getProfileDataLocal();
          props.navigation.navigate('Settings');
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="settings"
          size={SizeConfig.width * 5}
          color={isActive('Settings') ? colors.primary : colors.black}
        />
        <Text
          style={[
            styles.menuItemText,
            isActive('Settings') && styles.activeMenuItemText,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.menuItem,
          isActive('AboutScreen') && styles.activeMenuItem,
        ]}
        onPress={() => {
          props.navigation.navigate('AboutScreen');
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="info"
          size={SizeConfig.width * 5}
          color={isActive('AboutScreen') ? colors.primary : colors.black}
        />
        <Text
          style={[
            styles.menuItemText,
            isActive('AboutScreen') && styles.activeMenuItemText,
          ]}
        >
          About Us
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <View style={styles.footerSection}>
        <Text style={styles.versionText}>App Version {appVersion.version}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            handleLogout({ navigation: navigation });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
          <MaterialIcons name="logout" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContentContainer: {
    flexGrow: 1,
    paddingVertical: SizeConfig.width * 8.3,
    paddingHorizontal: SizeConfig.width * 5.2,
    backgroundColor: colors.white,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatar: {
    width: SizeConfig.width * 22,
    height: SizeConfig.width * 22,
    borderRadius: SizeConfig.width * 14,
    marginBottom: SizeConfig.width * 2.5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userName: {
    fontSize: SizeConfig.fontSize * 4.5,
    fontWeight: '700',
    color: colors.black,
    marginBottom: SizeConfig.width * 1.2,
  },
  userContact: {
    fontSize: SizeConfig.fontSize * 3,
    color: colors.secondary,
    fontFamily: fonts.medium,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    opacity: 0.3,
    marginVertical: SizeConfig.width * 3.2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConfig.width * 3.3,
    paddingHorizontal: SizeConfig.width * 2.1,
    borderRadius: SizeConfig.width * 2.1,
    marginBottom: SizeConfig.width * 2.5,
    backgroundColor: colors.white,
    gap: SizeConfig.width * 2,
  },
  activeMenuItem: {
    backgroundColor: `${colors.primary}20`,
  },
  menuItemText: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.black,
    flex: 1,
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
    borderTopWidth: 1,
    borderTopColor: `${colors.border}40`,
    paddingTop: SizeConfig.width * 3.7,
    paddingBottom: SizeConfig.width * 1.6,
  },
  versionText: {
    fontSize: SizeConfig.width * 2.9,
    fontFamily: fonts.semiBold,
    color: colors.secondary,
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

export default CustomDrawerUi;
