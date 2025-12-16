import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import SelectCareer from '../components/features/SelectCareer.jsx';
import Footer from '../components/common/Footer.jsx';

export default function CareerPage() {
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


