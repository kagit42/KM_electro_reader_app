import React, { useEffect, useState } from 'react';
import {
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

  const handleCallLogPress = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      );

      setPermissionDetails(prev => ({
        ...prev,
        callLog: result === 'granted',
      }));
    }
  };

  const handleContactPress = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );

      setPermissionDetails(prev => ({
        ...prev,
        contacts: result === 'granted',
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />

      <View
        style={{
          flex: 1,
        }}
      >
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              hitSlop={30}
              style={styles.backButton}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={SizeConfig.width * 6}
                color={colors.color_4C5F66}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Settings</Text>
          </View>

          {/* <View style={styles.profileRow}>
            <Image
              source={require('../../assets/images/home/avatar.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>Suhail S</Text>
              <Text style={styles.lastActivity}>Last activity 2 hours ago</Text>
            </View>
          </View> */}

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

            {/* <View style={styles.row}>
              <View style={styles.rowLeft}>
                <MaterialIcons
                  name="history"
                  size={SizeConfig.width * 5}
                  color={colors.color_4C5F66}
                />
                <Text style={styles.rowLabel}>Call Log</Text>
              </View>
              <Switch
                onPress={handleCallLogPress}
                value={permissionDetails.callLog}
              />
            </View>
            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <MaterialIcons
                  name="call"
                  size={SizeConfig.width * 5}
                  color={colors.color_4C5F66}
                />
                <Text style={styles.rowLabel}>Contact</Text>
              </View>
              <Switch
                onPress={handleContactPress}
                value={permissionDetails.contacts}
              />
            </View>
             */}
            <View style={styles.divider} />
          </View>
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
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: SizeConfig.height * 2.5,
    marginBottom: SizeConfig.height * 2,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.3,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SizeConfig.width * 5,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 4,
    color: colors.black,
    paddingRight: SizeConfig.width * 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeConfig.width * 3,
    paddingHorizontal: SizeConfig.width * 5,
    marginBottom: SizeConfig.height * 3,
  },
  avatar: {
    width: SizeConfig.width * 15,
    height: SizeConfig.width * 15,
    resizeMode: 'cover',
    borderRadius: SizeConfig.width * 7.5,
  },
  userName: {
    fontFamily: fonts.semiBold,
    fontSize: SizeConfig.fontSize * 3.8,
    color: colors.black,
  },
  lastActivity: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3,
    color: colors.secondary,
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
});

export default Settings;
