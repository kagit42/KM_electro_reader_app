import { configureStore } from '@reduxjs/toolkit';
import { LoginSlice } from './slices/authSlice';
import { OcrApi } from './slices/ocrSlice';
import { ProfileSlice } from './slices/profileSlice';

export const Store = configureStore({
  reducer: {
    [LoginSlice.reducerPath]: LoginSlice.reducer,
    [OcrApi.reducerPath]: OcrApi.reducer,
    [ProfileSlice.reducerPath]: ProfileSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      LoginSlice.middleware,
      OcrApi.middleware,
      ProfileSlice.middleware,
    ),
});
