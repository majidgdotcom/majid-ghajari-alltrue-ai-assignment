import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportRequestData } from '../interfaces/ISupportRequest';



const initialState: SupportRequestData[] = [
  { email: 'majidgdotcom@gmail.com', fullName: 'Majid Ghajari', issueType: 'Bug Report', steps: [{ step: '1' }], tags: ['problem'] }
]

const supportRequestSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    submitSupportRequest: (state, action: PayloadAction<SupportRequestData>) => {
      state.push(action.payload);
    },
  },
});

export const { submitSupportRequest } = supportRequestSlice.actions;
export default supportRequestSlice.reducer;