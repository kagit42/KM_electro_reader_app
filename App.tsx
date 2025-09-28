import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import StackNavigation from './app/navigations/StackNavigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { Store } from './app/redux/Store';
import { NetworkProvider } from './app/ContextApi/NetworkProvider';
import { CopilotProvider } from 'react-native-copilot';
import { SizeConfig } from './app/assets/size/size';
import { NavigationType } from './app/navigations/NavigationType';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const navigationRef = createNavigationContainerRef<NavigationType>();

export function navigate(name: keyof NavigationType, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

function App() {
  return (
    <Provider store={Store}>
      <CopilotProvider androidStatusBarVisible={true}>
        <NetworkProvider>
          <GestureHandlerRootView>
            <NavigationContainer ref={navigationRef}>
              <StackNavigation />
              <Toast />
            </NavigationContainer>
          </GestureHandlerRootView>
        </NetworkProvider>
      </CopilotProvider>
    </Provider>
  );
}

export default App;
