import { createNavigationContainerRef, NavigationContainer, useNavigation } from '@react-navigation/native';
import StackNavigation from './app/navigations/StackNavigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { Store } from './app/redux/Store';
import { NetworkProvider } from './app/ContextApi/NetworkProvider';
import { CopilotProvider } from 'react-native-copilot';
import { SizeConfig } from './app/assets/size/size';
import { NavigationType } from './app/navigations/NavigationType';

export const navigationRef = createNavigationContainerRef<NavigationType>();

export function navigate(name: keyof NavigationType, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

function App() {
  return (
    <Provider store={Store}>
      <CopilotProvider verticalOffset={SizeConfig.height * 5.5}>
        <NetworkProvider>
          <NavigationContainer ref={navigationRef}>
            <StackNavigation />
            <Toast />
          </NavigationContainer>
        </NetworkProvider>
      </CopilotProvider>
    </Provider>
  );
}

export default App;
