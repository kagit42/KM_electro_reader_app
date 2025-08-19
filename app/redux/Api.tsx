import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
// import {getappToken} from '../utils/Utils';
// import {decryptPayload, encryptPayload} from '../utils/cryptoHelper';
// import {formatTimestamp} from '../globalComponents/GlobalComponents';

export const BaseUrl = 'https://c05681db9215.ngrok-free.app/';

export const baseQuery: BaseQueryFn<any, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
//   const appToken = await getappToken();
//   const timestamp = await formatTimestamp();
  

//   const payload = {
//     token: appToken || '',
//     time: timestamp,
//   };

//   const encryptedAppToken = encryptPayload(payload);

  const baseQuery = fetchBaseQuery({
    baseUrl: BaseUrl,
    // prepareHeaders: headers => {
    //   if (appToken) {
    //     headers.set('Authorization', `Bearer ${encryptedAppToken}`);
    //   }
    //   return headers;
    // },
  });
  return baseQuery(args, api, extraOptions);
};
