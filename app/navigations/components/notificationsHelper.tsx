import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigate } from '../../../App';
// import {navigate} from './AppNavigation'

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
  const token = await messaging().getToken();

  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED: {
        console.log('Notification dismissed');
        break;
      }
      case EventType.PRESS: {
        console.log('Notification pressed');
        navigate('DetailScreen');
        break;
      }
    }
  });

  messaging().onMessage(showForegroundNotification);
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    console.log('Background state: Notification tapped:');
    // if (remoteMessage?.notification?.data) {
    // const { type } = remoteMessage?.notification?.data;
    navigate('DetailScreen');
    // }
  });
};
