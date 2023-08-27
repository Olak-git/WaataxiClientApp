import { createSlice } from "@reduxjs/toolkit";

export const authTelSlice = createSlice({
    name: 'auth',
    initialState: {
        data: {
            tel: null,
            verify_code: null
        }
    },
    reducers: {
        setTel: (state, action) => {
            state.data.tel = action.payload
        },
        setVerifyCode: (state, action) => {
            state.data.verify_code = action.payload
        }
    }
})

export default authTelSlice.reducer;
export const { setTel, setVerifyCode } = authTelSlice.actions