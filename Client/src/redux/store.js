import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import metricsReducer from './slices/metricSlice'

export const store =configureStore({
    reducer : {
        auth : authReducer,
        metrics: metricsReducer
    }
})