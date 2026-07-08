import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  phoneNumber: string;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    logout(state) {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;