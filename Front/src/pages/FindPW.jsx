import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import Footer from '../components/common/Footer.jsx';
import FindPW from '../components/features/FindPW.jsx';

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


