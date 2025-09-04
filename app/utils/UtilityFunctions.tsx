import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export function charOnlyValidate(text: string) {
  const formattedText = text.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ');
  return formattedText;
}

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
