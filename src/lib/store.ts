import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./redux/authSlice";

export const store = () => {
  return configureStore({
    reducer: {
      user: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
