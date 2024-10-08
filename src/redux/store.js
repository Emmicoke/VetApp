import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import userReducer from "./userSlice"

export const store = configureStore({
    reducer: {
        user: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})
  })