import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyStack from './app/navigations/StackNavigation';
import { Provider } from 'react-redux';
import { store } from './app/redux/Store';
import { getItem } from './app/util/UtilityFunctions';
import DrawerNavigation from './app/navigations/DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { NetworkProvider } from './app/util/NetworkProvider';
import Toast from 'react-native-toast-message';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await getItem('userAccessToken');
      setToken(userToken);
    };

    checkUserToken();
  }, []);

  return (
    <Provider store={store}>
      <NetworkProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            {token ? <DrawerNavigation /> : <MyStack />}
             <Toast />
          </SafeAreaProvider>
        </NavigationContainer>
      </NetworkProvider>
    </Provider>
  );
}

export default App;
