import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppRegistry, Text, TextInput } from 'react-native';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { setNotificationsHandler } from './app/navigations/components/notificationsHelper';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
setNotificationsHandler()

const Root = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <App />
  </GestureHandlerRootView>
);

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent(appName, () => Root);
