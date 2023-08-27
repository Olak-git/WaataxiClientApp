import { createSlice } from "@reduxjs/toolkit";

export const reloadSlice = createSlice({
    name: 'reload',
    initialState: {
        value: 0
    },
    reducers: {
        setReload: (state) => {
            ++state.value;
        }
    }
})

export default reloadSlice.reducer;
export const { setReload } = reloadSlice.actions