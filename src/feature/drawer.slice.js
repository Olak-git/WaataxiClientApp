import { createSlice } from "@reduxjs/toolkit";

export const drawerSlice = createSlice({
    name: 'drawer',
    initialState: {
        visible: false
    },
    reducers: {
        setDrawer: (state, action) => {
            state.visible = action.payload
        }
    }
})

export default drawerSlice.reducer;
export const { setDrawer } = drawerSlice.actions