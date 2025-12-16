import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import Footer from '../components/common/Footer.jsx';
import ScoreBoard from '../components/features/ScoreBoard.jsx';
import '../styles/Pages.css';

function ScoreBoardPage() {
  return (
    <div className="page">
      <NavBar />
      <main className="page-main-padding">
        <ScoreBoard />
      </main>
      <Footer />
    </div>
  );
}

export default ScoreBoardPage