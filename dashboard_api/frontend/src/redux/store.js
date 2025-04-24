import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appsReducer from './slices/appsSlice';
import uiReducer from './slices/uiSlice';
import statsReducer from './slices/statsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    apps: appsReducer,
    ui: uiReducer,
    stats: statsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 