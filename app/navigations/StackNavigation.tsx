import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParam } from './RootType';
import DrawerNavigation from './DrawerNavigation';
import ExploreMore from '../screens/home/ExploreMore';
import SplashScreen from '../screens/auth/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParam>();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="DrawerNav"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="ExploreMore" component={ExploreMore} />
      <Stack.Screen name="DrawerNav" component={DrawerNavigation} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
    </Stack.Navigator>
  );
}

export default MyStack;
