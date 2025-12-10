import React from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import AiInterview from '../components/features/AiInterview.jsx';
import '../styles/Pages.css';

export default function AiInterviewPage() {
  return (
    <div className="page">
      <NavBar />
      <main className="page-main-padding">
        <AiInterview />
      </main>
      <Footer />
    </div>
  );
}

