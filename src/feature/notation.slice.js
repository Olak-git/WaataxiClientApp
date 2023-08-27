import { createSlice } from "@reduxjs/toolkit";

export const notationSlice = createSlice({
    name: 'notation',
    initialState: {
        data: []
    },
    reducers: {
        addUser: (state, action) => {
            if(state.data.indexOf(action.payload) == -1) {
                state.data.push(action.payload);
            }
        }
    }
})

export default notationSlice.reducer;
export const { addUser } = notationSlice.actions