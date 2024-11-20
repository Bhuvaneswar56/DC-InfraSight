import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') ||'',
    user:null,
}

export const authorizationSlice = createSlice({
    name:'auth',
    initialState,
    reducers : {
        SET_AUTH: (state, action) => {
            state.user = action.payload;
            state.token = localStorage.getItem('token')
        },
        LOGOUT: (state, action) => {
            state.user = null
            state.token = null
            localStorage.clear()
        },  
    }
})

export const { SET_AUTH, LOGOUT } = authorizationSlice.actions

export default authorizationSlice.reducer