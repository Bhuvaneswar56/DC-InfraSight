import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') || '',
    user: null,
    isGuest: localStorage.getItem('guestMode') === 'true'
};

export const authorizationSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        SET_AUTH: (state, action) => {
            if (action.payload.isGuest) {
                state.isGuest = true;
                state.user = {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    isGuest: true
                };
                state.token = '';
            } else {
                state.user = action.payload;
                state.token = localStorage.getItem('token');
                state.isGuest = false;
            }
        },
        LOGOUT: (state) => {
            state.user = null;
            state.token = null;
            state.isGuest = false;
            localStorage.clear();
            localStorage.removeItem('guestMode');
        }
    }
});

export const { SET_AUTH, LOGOUT } = authorizationSlice.actions;

export default authorizationSlice.reducer;