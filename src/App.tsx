import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import SupportRequests from './components/supportRequest/SupportRequests';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<SupportRequests />} />
        <Route path="/" element={<SupportRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
