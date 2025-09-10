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
          url: 'customuser/send_otp/',
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
          url: 'customuser/verify_otp/',
          method: 'POST',
          body: {
            verify_id: verifyid,
            otp,
          },
        };
      },
    }),

    createUser: builder.mutation({
      query: ({ payload }) => {
        console.log('payload ', payload);

        return {
          url: 'customuser/register/',
          method: 'POST',
          body: payload,
        };
      },
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useCreateUserMutation,
} = LoginSlice;
