import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import ScoreBoard from '../ui/ScoreBoard.jsx';

function ScoreBoardPage() {
  return (
    <div className="page">
      <NavBar />
      <main style={{ padding: '20px 0' }}>
        <ScoreBoard />
      </main>
      <Footer />
    </div>
  );
}

export default ScoreBoardPage