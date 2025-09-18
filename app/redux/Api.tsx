import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import * as Keychain from 'react-native-keychain';

export const BaseUrl = 'https://z1v6j16z-8001.inc1.devtunnels.ms/';

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
