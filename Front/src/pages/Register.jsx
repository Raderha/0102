import React from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Register from '../components/features/Register.jsx';

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


