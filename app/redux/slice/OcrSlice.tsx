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
          url: 'ocr_meter/',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useGetMeterReadingMutation } = OcrApi;
