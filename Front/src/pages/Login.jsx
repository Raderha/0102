import React from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Login from '../components/features/Login.jsx';

export default function LoginPage() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <Login />
      </main>
      <Footer />
    </div>
  );
}


