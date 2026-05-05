import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'info'
  }
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    }
  },
});

export const { setLoading, showToast, hideToast } = globalSlice.actions;
export default globalSlice.reducer;
