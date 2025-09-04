import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/home/Home';
import ExploreMoreAnalytics from '../screens/home/ExploreMoreAnalytics';
import DetailScreen from '../screens/detail/DetailScreen';
import ViewAllHistory from '../screens/home/ViewAllHistory';
import Settings from '../screens/settings/Settings';
import { NavigationType } from './NavigationType';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomDrawerUi from './components/CustomDrawerUi';
import AboutScreen from '../screens/about/AboutScreen';
import SubmitionPreview from '../screens/submition/SubmitionPreview';
import OcrScreen from '../screens/submition/OcrScreen';

function HomeStack() {
  const Stack = createNativeStackNavigator<NavigationType>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewAllHistory" component={ViewAllHistory} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="SubmitionPreview" component={SubmitionPreview} />
      <Stack.Screen name="OcrScreen" component={OcrScreen} />

    </Stack.Navigator>
  );
}

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator<NavigationType>();
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      drawerContent={props => <CustomDrawerUi {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
    >
      <Drawer.Screen name="HomeStack" component={HomeStack} />
      <Drawer.Screen
        name="ExploreMoreAnalytics"
        component={ExploreMoreAnalytics}
      />
      {/* <Drawer.Screen name="DetailScreen" component={DetailScreen} /> */}
      <Drawer.Screen name="ViewAllHistory" component={ViewAllHistory} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="AboutScreen" component={AboutScreen} />
      <Drawer.Screen name="DetailScreen" component={DetailScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
