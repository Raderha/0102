import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import SelectCareer from '../ui/SelectCareer.jsx';
import Footer from '../ui/Footer.jsx';

export default function Career() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <SelectCareer />
      </main>
      <Footer />
    </div>
  );
}


