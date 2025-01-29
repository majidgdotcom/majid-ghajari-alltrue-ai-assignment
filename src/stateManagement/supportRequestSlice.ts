import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportRequestData } from '../interfaces/ISupportRequest';

const initialState: SupportRequestData[] = []

const supportRequestSlice = createSlice({
  name: 'supportRequest',
  initialState,
  reducers: {
    submitSupportRequest: (state, action: PayloadAction<SupportRequestData>) => {
      state.push(action.payload);
    },
  },
});

export const { submitSupportRequest } = supportRequestSlice.actions;
export default supportRequestSlice.reducer;