import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Home from '../screens/home/Home';
import { SizeConfig } from '../assets/size/size';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AboutScreen from '../screens/about/AboutScreen';
import RaisedRequestScreen from '../screens/request/RaisedRequestScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { COLORS } from '../util/Theme';
import ExploreMore from '../screens/home/ExploreMore';
import MeterReader from '../screens/meterReader/MeterReader';
import ViewDetailsScreen from '../screens/details/ViewDetailsScreen';

const Drawer = createDrawerNavigator();

const user = {
  name: 'Suhail S',
  phone: '9447847176',
  email: 'suhail@example.com',
  avatar: require('../assets/images/home/avatar.png'),
};

const requestsCount = 8;
const appVersion = 'v1.0.0';

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => console.log('Logout pressed'),
      },
    ],
    { cancelable: true },
  );
};

const CustomDrawerContent = (props: any) => {
  const currentRoute = props.state.routeNames[props.state.index];

  const isActive = (routeName: string) => currentRoute === routeName;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContentContainer}
    >
      {/* User Info */}
      <View style={styles.userInfoSection}>
        <Image source={user.avatar} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userContact}>{user.phone}</Text>
        <Text style={styles.userContact}>{user.email}</Text>
      </View>

      <View style={styles.divider} />

      {/* Menu Items */}
      <TouchableOpacity
        style={[styles.menuItem, isActive('Home') && styles.activeMenuItem]}
        onPress={() => props.navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="home"
          size={SizeConfig.width * 5}
          color={isActive('Home') ? COLORS.primary : COLORS.placeholder}
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
        style={[styles.menuItem, isActive('Requests') && styles.activeMenuItem]}
        onPress={() => props.navigation.navigate('Requests')}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="cloud-upload"
          size={SizeConfig.width * 5}
          color={isActive('Requests') ? COLORS.primary : COLORS.placeholder}
        />
        <Text
          style={[
            styles.menuItemText,
            isActive('Requests') && styles.activeMenuItemText,
          ]}
        >
          Requests Raised
        </Text>
        {requestsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{requestsCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, isActive('Settings') && styles.activeMenuItem]}
        onPress={() => props.navigation.navigate('Settings')}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="settings"
          size={SizeConfig.width * 5}
          color={isActive('Settings') ? COLORS.primary : COLORS.placeholder}
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
        style={[styles.menuItem, isActive('AboutUs') && styles.activeMenuItem]}
        onPress={() => props.navigation.navigate('AboutUs')}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="info"
          size={SizeConfig.width * 5}
          color={isActive('AboutUs') ? COLORS.primary : COLORS.placeholder}
        />
        <Text
          style={[
            styles.menuItemText,
            isActive('AboutUs') && styles.activeMenuItemText,
          ]}
        >
          About Us
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      {/* Footer */}
      <View style={styles.footerSection}>
        <Text style={styles.versionText}>App Version {appVersion}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
          <MaterialIcons name="logout" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#fff' },
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="AboutUs" component={AboutScreen} />
      <Drawer.Screen name="ViewDetailsScreen" component={ViewDetailsScreen} />
      <Drawer.Screen name="MeterReader" component={MeterReader} />
      <Drawer.Screen
        name="ExploreMore"
        options={{
          swipeEnabled: false,
        }}
        component={ExploreMore}
      />
      <Drawer.Screen
        name="Requests"
        component={RaisedRequestScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Raised Request',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ paddingHorizontal: 18 }}
            >
              <MaterialIcons name="menu" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  drawerContentContainer: {
    flexGrow: 1,
    paddingVertical: SizeConfig.width * 8.3,
    paddingHorizontal: SizeConfig.width * 5.2,
    backgroundColor: COLORS.white,
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
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: SizeConfig.fontSize * 4.5,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SizeConfig.width * 1.2,
  },
  userContact: {
    fontSize: SizeConfig.fontSize * 3,
    color: COLORS.placeholder,
    marginVertical: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.placeholder,
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
    backgroundColor: COLORS.white,
  },
  activeMenuItem: {
    backgroundColor: `${COLORS.primary}20`,
  },
  menuItemText: {
    fontSize: SizeConfig.fontSize * 3.5,
    color: COLORS.black,
    marginLeft: SizeConfig.width * 4.1,
    fontWeight: '600',
    flex: 1,
  },
  activeMenuItemText: {
    color: COLORS.primary,
  },
  badge: {
    minWidth: SizeConfig.width * 4.5,
    height: SizeConfig.width * 4.5,
    paddingHorizontal: 6,
    backgroundColor: COLORS.primary,
    borderRadius: SizeConfig.width * 2.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SizeConfig.width * 2.5,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: `${COLORS.placeholder}40`,
    paddingTop: SizeConfig.width * 3.7,
    paddingBottom: SizeConfig.width * 1.6,
  },
  versionText: {
    fontSize: SizeConfig.width * 2.9,
    color: COLORS.placeholder,
    textAlign: 'center',
    marginBottom: SizeConfig.width * 2.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: SizeConfig.width * 2.5,
    borderRadius: SizeConfig.width * 2.5,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SizeConfig.width * 3.7,
    fontWeight: '700',
    marginRight: SizeConfig.width * 2.5,
  },
});
