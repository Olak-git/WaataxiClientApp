import { createSlice } from "@reduxjs/toolkit";

export const coursesSlice = createSlice({
    name: 'courses',
    initialState: {
        instantanee: [],
        covoiturage: [],
        reservation_covoiturage: [],
        reservation: []
    },
    reducers: {
        setStoreCourseInstantanee: (state, action) => {
            state.instantanee = [...action.payload]
        },
        setStoreCovoiturage: (state, action) => {
            state.covoiturage = [...action.payload]
        },
        setStoreReservationCovoiturage: (state, action) => {
            state.reservation_covoiturage = [...action.payload]
        },
        setStoreReservation: (state, action) => {
            state.reservation = [...action.payload]
        },
        clearStoreCourses: (state) => {
            state.instantanee = [];
            state.covoiturage = [];
            state.reservation_covoiturage = [];
            state.reservation = [];
        }
    }
})

export default coursesSlice.reducer;
export const { setStoreCourseInstantanee, setStoreCovoiturage, setStoreReservationCovoiturage, setStoreReservation, clearStoreCourses } = coursesSlice.actions