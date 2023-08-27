import { createSlice } from "@reduxjs/toolkit";
import { getVersion } from "react-native-device-info";

export const initSlice = createSlice({
    name: 'init',
    initialState: {
        presentation: false,
        welcome: false,
        stopped: false,
        refresh_ci: true,
        refresh_cr: true,
        otp_authentication: false,
        with_portefeuille: false,
        app_current_version: getVersion()
    },
    reducers: {
        setPresentation: (state, action) => {
            state.presentation = action.payload
        },
        setWelcome: (state, action) => {
            state.welcome = action.payload
        },
        setStopped: (state, action) => {
            state.stopped = action.payload
        },
        setRefreshCoursesInstantanees: (state, action) => {
            state.refresh_ci = action.payload
        },
        setRefreshReservations: (state, action) => {
            state.refresh_cr = action.payload
        },
        setWithPortefeuille: (state, action) => {
            state.with_portefeuille = action.payload
        },
        setOtpAuthentication: (state, action) => {
            state.otp_authentication = action.payload
        },
        setAppcurrentVersion: (state, action) => {
            state.app_current_version = action.payload
        }
    }
})

export default initSlice.reducer;
export const { setPresentation, setWelcome, setStopped, setRefreshCoursesInstantanees, setRefreshReservations, setWithPortefeuille, setAppcurrentVersion } = initSlice.actions