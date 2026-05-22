import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import modelOpeningSlice from './modelOpeningSlice.js'
import chatWindowSlice from './chatWindowSlice.js'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    modelopen:modelOpeningSlice,
    chatWindow:chatWindowSlice
  },
})