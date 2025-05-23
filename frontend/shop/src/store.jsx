import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './slices/loginSlice'

export const store = configureStore({
  reducer: { 
    "loginSlice": loginSlice
  }
})
