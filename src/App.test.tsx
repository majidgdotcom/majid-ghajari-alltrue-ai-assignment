import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SnackbarProvider } from 'notistack';
import SupportRequests from './components/supportRequest/SupportRequests';
import supportRequestReducer from './stateManagement/supportRequestSlice';

// App.tsx is just a router shell — there is nothing meaningful to unit test there.
// We test the main page component directly instead.
// (react-router-dom v7 is ESM-only and cannot be resolved by CRA's CommonJS Jest setup.)
const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: { supportRequest: supportRequestReducer } });
  return render(
    <Provider store={store}>
      <SnackbarProvider>{ui}</SnackbarProvider>
    </Provider>
  );
};

test('renders the submit button', () => {
  renderWithProviders(<SupportRequests />);
  expect(screen.getByRole('button', { name: /submit support request/i })).toBeInTheDocument();
});

test('shows empty state message when no requests have been submitted', () => {
  renderWithProviders(<SupportRequests />);
  expect(screen.getByText(/no requests submitted yet/i)).toBeInTheDocument();
});
