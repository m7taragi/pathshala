import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import globalReducer from './globalSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    global: globalReducer,
  },
});
