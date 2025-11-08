import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Career from './pages/Career.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import FindPWPage from './pages/FindPW.jsx';
import UploadFilePage from './pages/UploadFile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/career" element={<Career />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/findpw" element={<FindPWPage />} />
        <Route path="/upload" element={<UploadFilePage />} />
      </Routes>
    </BrowserRouter>
  );
}


