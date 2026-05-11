# Support Request Form

A React + TypeScript single-page application for submitting and viewing support requests. Built as a front-end take-home assignment.

## Features

- Submit support requests via a modal dialog form
- Form validation with real-time error feedback
- Dynamic "Steps to Reproduce" list (add / remove steps)
- Multi-select tags (UI, Backend, Performance)
- Submitted requests displayed as cards in a responsive grid
- Success / error toast notifications

## Tech Stack

| Concern | Library |
|---|---|
| UI framework | [Material UI v6](https://mui.com/) |
| Form management | [React Hook Form](https://react-hook-form.com/) |
| Schema validation | [Zod](https://zod.dev/) |
| State management | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Notifications | [notistack](https://notistack.com/) |
| Language | TypeScript |

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/
│   └── supportRequest/
│       ├── SupportRequestForm.tsx   # Modal form with validation
│       ├── SupportRequestForm.test.tsx
│       └── SupportRequests.tsx      # List of submitted requests
├── interfaces/
│   └── ISupportRequest.ts           # TypeScript types
└── stateManagement/
    ├── store.ts
    └── supportRequestSlice.ts       # Redux slice
```

## Notes

- State is held in memory (Redux store). Refreshing the page clears submissions — a persistent backend or localStorage layer would be the natural next step.
