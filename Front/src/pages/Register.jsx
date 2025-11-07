import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import Register from '../ui/Register.jsx';

export default function RegisterPage() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <Register />
      </main>
      <Footer />
    </div>
  );
}


