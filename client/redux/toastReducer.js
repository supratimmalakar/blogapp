import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open : false,
    message : "",
    severity : "success"
}

export const toastSlice = createSlice({
    name : 'toast',
    initialState,
    reducers : {
        openToast : (state, action) => {
            state.open = true,
            state.message = action.payload.message,
            state.severity = action.payload.severity
        },
        closeToast : (state) => {
            state.open = false
        },
        errorToast : (state) => {
            state.open = true,
            state.message = "There was an error.",
            state.severity = "error"
        }
    }
})

export const {openToast, closeToast, errorToast} = toastSlice.actions

export default toastSlice.reducer