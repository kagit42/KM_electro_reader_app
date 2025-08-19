import { configureStore } from '@reduxjs/toolkit';
import { LoginSlice } from './slice/authSlice';

export const store = configureStore({
  reducer: {
    [LoginSlice.reducerPath]: LoginSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(LoginSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
