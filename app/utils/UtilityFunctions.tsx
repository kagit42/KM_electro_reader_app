import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const setItem = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Saved ${key} = ${jsonValue}`);
  } catch (e) {
    console.error('Error setting item in AsyncStorage:', e);
  }
};

export const getItem = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting item from AsyncStorage:', e);
    return null;
  }
};

// Toast

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
