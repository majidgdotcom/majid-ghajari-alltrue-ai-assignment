import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SnackbarProvider } from "notistack";
import SupportRequestForm from "./SupportRequestForm";
import supportRequestReducer from "../../stateManagement/supportRequestSlice";

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { supportRequest: supportRequestReducer },
  });
  return render(
    <Provider store={store}>
      <SnackbarProvider>{ui}</SnackbarProvider>
    </Provider>
  );
};

describe("SupportRequestForm", () => {
  it("opens the dialog when the button is clicked", async () => {
    renderWithProviders(<SupportRequestForm />);
    userEvent.click(screen.getByText("Submit Support Request"));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderWithProviders(<SupportRequestForm />);
    userEvent.click(screen.getByText("Submit Support Request"));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    // Click the Submit button inside the dialog
    const submitBtn = screen.getByRole("button", { name: /^submit$/i });
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Full Name is required")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Issue Type is required")).toBeInTheDocument();
    });
  });

  it("closes the dialog on Cancel", async () => {
    renderWithProviders(<SupportRequestForm />);
    userEvent.click(screen.getByText("Submit Support Request"));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // MUI Dialog has exit animations — wait for it to leave the DOM
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("submits successfully with valid data", async () => {
    renderWithProviders(<SupportRequestForm />);
    userEvent.click(screen.getByText("Submit Support Request"));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    userEvent.type(screen.getByLabelText(/full name/i), "Jane Doe");
    userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");

    // Open Issue Type dropdown and select an option
    fireEvent.mouseDown(screen.getByRole("combobox", { name: /issue type/i }));
    await waitFor(() => screen.getByRole("listbox", { name: /issue type/i }));
    userEvent.click(screen.getByRole("option", { name: "Bug Report" }));

    // Wait for the dropdown to close before continuing —
    // while open, MUI sets aria-hidden on the dialog background,
    // which makes the Submit button invisible to getByRole.
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );

    userEvent.type(screen.getByLabelText(/step 1/i), "Reproduce the issue");

    userEvent.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
