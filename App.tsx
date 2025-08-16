import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './app/screens/home/Home';
import DrawerNavigation from './app/navigations/DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './app/navigations/StackNavigation';

function App() {
  return (
    <SafeAreaProvider>
      <MyStack />
    </SafeAreaProvider>
  );
}

export default App;
