import { createApi } from  '@reduxjs/toolkit/query/react';
import { baseQuery } from '../Api';

export const ProfileSlice = createApi({
  reducerPath: 'ProfileSlice',
  baseQuery: baseQuery,
  endpoints: builder => ({
    getProfileData: builder.mutation<any, { mobileNumber: string }>({
      query: ({ mobileNumber }) => {
        return {
          url: 'customuser/profile/',
          method: 'POST',
          body: {
            mobile_number: mobileNumber,
          },
        };
      },
    }),
  }),
});

export const { useGetProfileDataMutation } = ProfileSlice;
