import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../Api';

export const LoginSlice = createApi({
  reducerPath: 'LoginSlice',
  baseQuery: baseQuery,
  endpoints: builder => ({
    sendOtp: builder.mutation<any, { mobileNumber: string }>({
      query: ({ mobileNumber }) => {
        console.log('Mobile Number:', mobileNumber);
        return {
          url: 'send_otp/',
          method: 'POST',
          body: {
            mobile_number: mobileNumber,
          },
        };
      },
    }),

    verifyOtp: builder.mutation<any, { verifyid: string; otp: string }>({
      query: ({ verifyid, otp }) => {
        console.log('verify_id Number:', verifyid, 'OTP:', otp);
        return {
          url: 'verify_otp/',
          method: 'POST',
          body: {
            verify_id: verifyid,
            otp,
          },
        };
      },
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = LoginSlice;
