import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './app/navigations/StackNavigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { Store } from './app/redux/Store';
import { NetworkProvider } from './app/ContextApi/NetworkProvider';
import { CopilotProvider } from 'react-native-copilot';
import { SizeConfig } from './app/assets/size/size';

function App() {
  return (
    <Provider store={Store}>
      <CopilotProvider verticalOffset={SizeConfig.height * 5.5}>
        <NetworkProvider>
          <NavigationContainer>
            <StackNavigation />
            <Toast />
          </NavigationContainer>
        </NetworkProvider>
      </CopilotProvider>
    </Provider>
  );
}

export default App;
