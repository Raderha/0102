import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import FindPW from '../ui/FindPW.jsx';

export default function FindPWPage() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <FindPW />
      </main>
      <Footer />
    </div>
  );
}


