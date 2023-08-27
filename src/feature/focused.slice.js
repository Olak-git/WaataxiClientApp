import { createSlice } from "@reduxjs/toolkit";

export const focusedSlice = createSlice({
    name: 'focused',
    initialState: {
        discuss: false,
        team: false,
        client: false
    },
    reducers: {
        setFocusedDiscuss: (state, action) => {
            state.discuss = action.payload
        },
        setFocusedTeam: (state, action) => {
            state.team = action.payload
        },
        setFocusedClient: (state, action) => {
            state.client = action.payload
        }
    }
})

export default focusedSlice.reducer;
export const { setFocusedDiscuss, setFocusedTeam, setFocusedClient} = focusedSlice.actions