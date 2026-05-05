import { createSlice } from '@reduxjs/toolkit';

// Try to get user info from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  isAuthenticated: !!userInfoFromStorage,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
