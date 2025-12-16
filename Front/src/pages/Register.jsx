import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import Footer from '../components/common/Footer.jsx';
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


