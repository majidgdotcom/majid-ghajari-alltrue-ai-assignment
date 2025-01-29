import { configureStore } from '@reduxjs/toolkit';
import supportRequestReducer from './supportRequestSlice';

export const store = configureStore({
  reducer: {
    form: supportRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;