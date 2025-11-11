import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import AiInterview from '../ui/AiInterview.jsx';

export default function AiInterviewPage() {
  return (
    <div className="page">
      <NavBar />
      <main style={{ padding: '20px 0' }}>
        <AiInterview />
      </main>
      <Footer />
    </div>
  );
}

