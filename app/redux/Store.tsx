import { configureStore } from '@reduxjs/toolkit';
import { LoginSlice } from './slice/authSlice';
import { OcrApi } from './slice/OcrSlice';

export const store = configureStore({
  reducer: {
    [LoginSlice.reducerPath]: LoginSlice.reducer,
    [OcrApi.reducerPath]: OcrApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(LoginSlice.middleware, OcrApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
