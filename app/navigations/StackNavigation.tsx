import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import SendOtp from '../screens/auth/SendOtp';
import VerifyOtp from '../screens/auth/VerifyOtp';
import CreateNewUser from '../screens/auth/CreateNewUser';
import DrawerNavigation from './DrawerNavigation';
import { NavigationType } from './NavigationType';
import OcrScreen from '../screens/submition/OcrScreen';
import NetworkIssueScreen from '../screens/auth/components/NetworkIssueScreen';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator<NavigationType>();
  return (
    <Stack.Navigator
     
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SendOtp" component={SendOtp} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="CreateNewUser" component={CreateNewUser} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="OcrScreen" component={OcrScreen} />
      <Stack.Screen name="NetworkIssueScreen" component={NetworkIssueScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
