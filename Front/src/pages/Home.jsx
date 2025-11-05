import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import Hero from '../ui/Hero.jsx';
import Features from '../ui/Features.jsx';
import Footer from '../ui/Footer.jsx';

export default function Home() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}


