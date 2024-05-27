import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import carsReducer from '../features/cars/carsSlice';
import userReducer from '../features/auth/userSlice';

// Combine all reducers
const rootReducer = combineReducers({
  cars: carsReducer,
  user: userReducer
});

// Configuration options for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  // Optionally define an array of reducer names to persist
  whitelist: ['user']
  // Or blacklist to exclude specific reducers
  // blacklist: ['cars']
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer
});

// Create the persisted store
export const persistor = persistStore(store);