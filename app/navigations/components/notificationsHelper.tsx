import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { navigate } from '../../../App';

const showForegroundNotification = async (message: any) => {
  if (!message || !message?.notification) {
    return;
  }
  const { title, body } = message.notification;

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
};

export const setNotificationsHandler = async () => {
  await messaging().registerDeviceForRemoteMessages();
  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.PRESS: {
        console.log('Notification pressed');
        navigate('DetailScreen');
        break;
      }
    }
  });
  messaging().onMessage(showForegroundNotification);
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    navigate('DetailScreen');
  });
};
