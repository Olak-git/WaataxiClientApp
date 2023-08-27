const { createSlice } = require("@reduxjs/toolkit");

export const picturesSlice = createSlice({
    name: 'pictures',
    initialState: {
        pictures: null
    },
    reducers: {
        setPicturesData: (state, action) => {
            state.pictures = action.payload
        }
    }
})

export default picturesSlice.reducer
export const { setPicturesData } = picturesSlice.actions
