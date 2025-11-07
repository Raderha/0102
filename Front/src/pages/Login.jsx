import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import Login from '../ui/Login.jsx';

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


