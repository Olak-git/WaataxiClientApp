import { createSlice } from "@reduxjs/toolkit";

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        covoiturage: false
    },
    reducers: {
        setDialogCovoiturage: (state, action) => {
            state.covoiturage = action.payload
        }
    }
})

export default dialogSlice.reducer;
export const { setDialogCovoiturage, setWelcome } = dialogSlice.actions