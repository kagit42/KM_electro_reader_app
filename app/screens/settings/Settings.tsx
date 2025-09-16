import React, { useEffect, useState } from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SizeConfig } from '../../assets/size/size';
import { colors, fonts } from '../../utils/Theme';
import Switch from './components/Switch';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigationType } from '../../navigations/NavigationType';
import LinearGradient from 'react-native-linear-gradient';

type SettingsProps = DrawerScreenProps<NavigationType, 'Settings'>;

const Settings = ({ navigation }: SettingsProps) => {
  const [permissionDetails, setPermissionDetails] = useState({
    notifications: false,
    location: false,
    camera: false,
    callLog: false,
    contacts: false,
  });

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const cameraGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        const contactsGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );
        const callLogGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        );
        const locationGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        let notificationsGranted = true;
        if (Platform.Version >= 33) {
          notificationsGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }

        setPermissionDetails({
          notifications: notificationsGranted,
          location: locationGranted,
          camera: cameraGranted,
          callLog: callLogGranted,
          contacts: contactsGranted,
        });
      }
    };

    checkPermissions();
  }, []);

  const handleNotificationPress = async () => {
    if (Platform.OS === 'android') {
      let result;
      if (Platform.Version >= 33) {
        result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } else {
        result = 'granted';
      }
      setPermissionDetails(prev => ({
        ...prev,
        notifications: result === 'granted',
      }));
    }
  };

  const handleLocationPress = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      setPermissionDetails(prev => ({
        ...prev,
        location:
          result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
          result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted',
      }));
    }
  };

  const handleCameraPress = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      setPermissionDetails(prev => ({
        ...prev,
        camera: result === 'granted',
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#1B2F50'} barStyle={'light-content'} />

      <LinearGradient
        colors={[colors.primary, '#1B2F50']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
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
      </LinearGradient>

      <View style={styles.mainWrapperComp}>
        <View style={styles.settingsList}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons
                name="notifications"
                size={SizeConfig.width * 5}
                color={colors.color_4C5F66}
              />
              <Text style={styles.rowLabel}>Push Notification</Text>
            </View>
            <Switch
              onPress={handleNotificationPress}
              value={permissionDetails.notifications}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons
                name="location-on"
                size={SizeConfig.width * 5}
                color={colors.color_4C5F66}
              />
              <Text style={styles.rowLabel}>Location</Text>
            </View>
            <Switch
              onPress={handleLocationPress}
              value={permissionDetails.location}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialIcons
                name="photo-camera"
                size={SizeConfig.width * 5}
                color={colors.color_4C5F66}
              />
              <Text style={styles.rowLabel}>Camera</Text>
            </View>
            <Switch
              onPress={handleCameraPress}
              value={permissionDetails.camera}
            />
          </View>
          <View style={styles.divider} />
        </View>

        <View style={styles.importentNoteComp}>
          <Text style={styles.importentNoteTitle}>Important Notice</Text>
          <Text style={styles.importentNoteSubText}>
            Please ensure that all required permissions are granted for the app
            to function properly.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2F50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConfig.height * 3,
    paddingHorizontal: SizeConfig.width * 6,
    gap: SizeConfig.width * 4,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SizeConfig.width * 5,
  },
  mainWrapperComp: {
    backgroundColor: colors.white,
    height: '100%',
    borderTopLeftRadius: SizeConfig.width * 7,
    borderTopRightRadius: SizeConfig.width * 7,
    paddingTop: SizeConfig.height * 2,
  },

  settingsList: {
    paddingHorizontal: SizeConfig.width * 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SizeConfig.height * 2,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeConfig.width * 3,
  },
  rowLabel: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.5,
    color: colors.black,
  },
  divider: {
    width: '100%',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    opacity: 0.6,
  },
  importentNoteComp: {
    paddingHorizontal: SizeConfig.width * 5,
    backgroundColor: colors.border,
    padding: SizeConfig.width * 4,
    borderRadius: SizeConfig.width * 3,
    marginHorizontal: SizeConfig.width * 5,
    marginTop: SizeConfig.height * 3.5,
    gap: SizeConfig.height * 0.5,
  },
  importentNoteTitle: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.4,
    color: colors.black,
  },
  importentNoteSubText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.black,
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
    fontSize: SizeConfig.fontSize * 5,
    color: colors.white,
    width: '100%',
  },
});

export default Settings;
