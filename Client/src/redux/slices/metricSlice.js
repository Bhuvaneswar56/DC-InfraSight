import { createSlice } from "@reduxjs/toolkit";

const metricsSlice = createSlice({

    name:'metrics',
    initialState:{
        data:[],
        
    },

    reducers :{
        SET_METRICS :(state,action)=>{
            state.data=action.payload
        }
    }

})

export const{SET_METRICS} = metricsSlice.actions;
export default metricsSlice.reducer
