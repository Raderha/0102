import React from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import SelectCareer from '../components/features/SelectCareer.jsx';
import Footer from '../components/layout/Footer.jsx';

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


