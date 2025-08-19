import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyStack from './app/navigations/StackNavigation';
import { Provider } from 'react-redux';
import { store } from './app/redux/Store';
import { getItem } from './app/util/UtilityFunctions';
import DrawerNavigation from './app/navigations/DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native';

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
      <NavigationContainer>
        <SafeAreaProvider>
          {token ? <DrawerNavigation /> : <MyStack />}
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
