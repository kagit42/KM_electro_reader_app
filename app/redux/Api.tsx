import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import * as Keychain from 'react-native-keychain';
import { ShowToast } from '../utils/UtilityFunctions';

export const BaseUrl = 'https://c7b09c702b1c.ngrok-free.app/';

export const baseQuery: BaseQueryFn<any, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const sendOtpObject = await Keychain.getGenericPassword({
    service: 'verifyOtp_service',
  });

  let accessToken: string | null = null;

  if (sendOtpObject) {
    try {
      const parsed = JSON.parse(sendOtpObject.password);
      accessToken = parsed.access_token ?? null;
    } catch {
      console.log(' Bearer token is not found');
      // ShowToast({
      //   title: 'Token not found',
      //   description: 'Bearer token is not found',
      //   type: 'error',
      // });
    }
  }

  console.log(accessToken);

  const baseQuery = fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: headers => {
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  });
  return baseQuery(args, api, extraOptions);
};
