import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
import notifee from '@notifee/react-native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { NavigationType } from '../navigations/NavigationType';

export function charOnlyValidate(text: string) {
  const formattedText = text.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ');
  return formattedText;
}

export const ShowToast = ({
  type,
  title,
  description,
}: {
  type: string;
  title: string;
  description: string;
}) => {
  Toast.show({
    type: type,
    text1: title,
    text2: description,
  });
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const checkAndSetFirstTime = async () => {
  try {
    const value = await AsyncStorage.getItem('is_FirstTime');

    if (value === null) {
      await AsyncStorage.setItem('is_FirstTime', 'true');
      console.log('is_FirstTime set to true');
      return true;
    } else {
      return value;
    }
  } catch (error) {
    console.error('Error accessing AsyncStorage:', error);
    return false;
  }
};

export const removeKeychainsLogout = async () => {
  console.log('Key chain is Cleared !!! ');

  try {
    await Keychain.resetGenericPassword({
      service: 'verifyOtp_service',
    });
    await Keychain.resetGenericPassword({
      service: 'otp_section',
    });
    await Keychain.resetGenericPassword({
      service: 'profileData_service',
    });
    await Keychain.resetGenericPassword({
      service: 'sendOtpObj',
    });
  } catch (error) {
    console.log(error);

    ShowToast({
      title: 'Something Went Wrong',
      description: `Something went wrong while performing Logout.`,
      type: 'error',
    });
  }
};

export const displayNotification = async (
  title: string,
  body: string,
  categoryId: string,
  data: { [key: string]: string | number | object },
) => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
      onlyAlertOnce: true,
      pressAction: { id: 'default' },
    },
    ios: {
      categoryId,
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });
};


