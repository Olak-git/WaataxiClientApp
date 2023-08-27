import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        data: [],
        count: 0
    },
    reducers: {
        addNotification: (state, action) => {
            if(state.data.indexOf(action.payload) == -1) {
                state.data.push(action.payload);
            }
        },
        resetNotifications: (state) => {
            state.data = [];
        },
        setCount: (state, action) => {
            state.count = action.payload;
        },
        resetCount: (state) => {
            state.count = 0
        }
    }
})

export default notificationsSlice.reducer;
export const { addNotification, resetNotifications, setCount, resetCount } = notificationsSlice.actions