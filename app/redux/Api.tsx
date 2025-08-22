import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

export const BaseUrl = 'https://ef231e04d8c3.ngrok-free.app/';

export const baseQuery: BaseQueryFn<any, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BaseUrl,
  });
  return baseQuery(args, api, extraOptions);
};
