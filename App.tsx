import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './app/navigations/StackNavigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { Store } from './app/redux/Store';
import { NetworkProvider } from './app/ContextApi/NetworkProvider';

function App() {
  return (
    <Provider store={Store}>
      <NetworkProvider>
        <NavigationContainer>
          <StackNavigation />
          <Toast />
        </NavigationContainer>
      </NetworkProvider>
    </Provider>
  );
}

export default App;
