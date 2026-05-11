import "@testing-library/jest-dom";

// Suppress two categories of noisy-but-harmless console.error in tests:
// 1. MUI v5/v6 fires TouchRipple / transition state updates outside act() in jsdom.
// 2. React 18 + older @testing-library/react emits a ReactDOMTestUtils.act deprecation.
// Neither affects actual test correctness.
const originalError = console.error.bind(console.error);
beforeAll(() => {
  console.error = (msg: string, ...args: unknown[]) => {
    if (typeof msg === "string") {
      if (
        msg.includes("inside a test was not wrapped in act") ||
        msg.includes("ReactDOMTestUtils.act` is deprecated")
      ) {
        return;
      }
    }
    originalError(msg, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
