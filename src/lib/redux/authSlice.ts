import { AuthStoreInterface } from "@/interfaces/auth.i";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateInterface {
  data: AuthStoreInterface | null;
  jwt: string | null;
}

const initialState: initialStateInterface = {
  data: null,
  jwt: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthStoreInterface; token: string }>
    ) => {
      state.data = action.payload.user;
      state.jwt = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("session", JSON.stringify(state));
      }
    },
    removeCredentials: (state, action) => {
      state.data = null;
      state.jwt = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("session");
      }
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
