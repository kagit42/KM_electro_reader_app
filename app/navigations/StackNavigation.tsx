import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParam } from './RootType';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';

const Stack = createNativeStackNavigator<RootStackParam>();

function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DrawerNav"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="DrawerNav" component={DrawerNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
