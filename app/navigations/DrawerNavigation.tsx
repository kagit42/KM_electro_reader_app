import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/home/Home';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SizeConfig } from '../assets/size/size';
const Drawer = createDrawerNavigator();

const CustomeDrawerUi = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View>
        <>
          <Image
            source={require('../assets/images/home/avatar.png')}
            style={{
              width: SizeConfig.width * 10,
              height: SizeConfig.width * 10,
            }}
          />
          <Text>suhail S</Text>
          <Text>1234567890</Text>
          <TouchableOpacity>
            <Text>View Profile</Text>
          </TouchableOpacity>
        </>
      </View>

      {/* <DrawerItemList {...props} /> */}
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={props => <CustomeDrawerUi {...props} />}
        initialRouteName="Home"
      >
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigation;
