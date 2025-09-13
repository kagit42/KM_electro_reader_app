import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import SendOtp from '../screens/auth/SendOtp';
import VerifyOtp from '../screens/auth/VerifyOtp';
import CreateNewUser from '../screens/auth/CreateNewUser';
import { NavigationType } from './NavigationType';
import OcrScreen from '../screens/submition/OcrScreen';
import NetworkIssueScreen from '../screens/auth/components/NetworkIssueScreen';
import Home from '../screens/home/Home';
import DetailScreen from '../screens/detail/DetailScreen';
import ViewAllHistory from '../screens/home/ViewAllHistory';
import ExploreMoreAnalytics from '../screens/home/ExploreMoreAnalytics';
import Settings from '../screens/settings/Settings';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SubmitionPreview from '../screens/submition/SubmitionPreview';
import AboutScreen from '../screens/about/AboutScreen';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator<NavigationType>();
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth Navs */}

      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SendOtp" component={SendOtp} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="CreateNewUser" component={CreateNewUser} />
      <Stack.Screen name="NetworkIssueScreen" component={NetworkIssueScreen} />

      {/* Main Screen Navs */}

      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="OcrScreen" component={OcrScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="ViewAllHistory" component={ViewAllHistory} />
      <Stack.Screen
        name="ExploreMoreAnalytics"
        component={ExploreMoreAnalytics}
      />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SubmitionPreview" component={SubmitionPreview} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
