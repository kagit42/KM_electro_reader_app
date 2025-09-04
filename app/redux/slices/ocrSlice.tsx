import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../Api';

export const OcrApi = createApi({
  reducerPath: 'OcrApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    getMeterReading: builder.mutation<
      any,
      { imageUrl: string; name?: string; type?: string }
    >({
      query: ({ imageUrl, name = 'meter.jpg', type = 'image/jpeg' }) => {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUrl,
          name,
          type,
        } as any);

        return {
          url: 'ocr/upload_preview/',
          method: 'POST',
          body: formData,
        };
      },
    }),
    getOcrReadings: builder.query({
      query: ({ page = 1 }) => {
        return {
          url: `ocr/meter_reading_list/?page=${page}`,
          method: 'GET',
        };
      },
    }),

    submitOcrReading: builder.mutation({
      query: ({ data }) => {
        return {
          url: `ocr/submit/`,
          method: 'POST',
          body: data,
        };
      },
    }),

    getAnalytics: builder.query({
      query: ({ filter = '15 days' }) => {
        return {
          url: `ocr/usage/?period=${filter}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetMeterReadingMutation,
  useLazyGetOcrReadingsQuery,
  useSubmitOcrReadingMutation,
  useLazyGetAnalyticsQuery,
} = OcrApi;
