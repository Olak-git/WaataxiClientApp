import { createSlice } from "@reduxjs/toolkit";

export const switchNotificationSlice = createSlice({
    name: 'switch_notification',
    initialState: {
        notify: false
    },
    reducers: {
        setNotify: (state, action) => {
            state.notify = action.payload
        }
    }
})

export default switchNotificationSlice.reducer;
export const { setNotify } = switchNotificationSlice.actions