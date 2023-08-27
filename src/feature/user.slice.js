import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        lastID: null,
        data: {}
    },
    reducers: {
        setLastID: (state, action) => {
            state.lastID = action.payload;
        },
        setUser: (state, action) => {
            for(let index in action.payload) {
                state.data[index] = action.payload[index];
            }
        },
        deleteIndex: (state, action) => {
            delete(state.data[action.payload]);
        },
        deleteUser: (state) => {
            state.data = {};
        }
    }
})

export default userSlice.reducer;
export const { setLastID, setUser, deleteIndex, deleteUser } = userSlice.actions