import { createSlice } from "@reduxjs/toolkit";

export const avatarSlice = createSlice({
    name: 'avatar',
    initialState: {
        src: null
    },
    reducers: {
        setSrc: (state, action) => {
            state.src = action.payload
        }
    }
})

export default avatarSlice.reducer;
export const { setSrc } = avatarSlice.actions