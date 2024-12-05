import { createSlice } from "@reduxjs/toolkit";

const metricsSlice = createSlice({

    name:'metrics',
    initialState:{
        data:[],
        alerts:[],
        incidents:[]
        
    },

    reducers :{
        SET_METRICS :(state,action)=>{
            state.data=action.payload
        },
        SET_ALERTS :(state,action)=>{
            state.alerts=action.payload
        },
        SET_INCIDENTS:(state,action)=>{
            state.incidents = action.payload
        }
        
    }

})

export const{SET_METRICS,SET_ALERTS, SET_INCIDENTS } = metricsSlice.actions;
export default metricsSlice.reducer
