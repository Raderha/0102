import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import Footer from '../components/common/Footer.jsx';
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


