import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './app/screens/home/Home';
import DrawerNavigation from './app/navigations/DrawerNavigation';

function App() {
  return (
    <SafeAreaProvider>
      <DrawerNavigation />;
    </SafeAreaProvider>
  );
}

export default App;
