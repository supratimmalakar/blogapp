import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './toastReducer'

export const store = configureStore({
    reducer: {
        toast: toastReducer
    },
})