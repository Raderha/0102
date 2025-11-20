import React, { useState, useEffect } from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import CommunityFilter from '../ui/CommunityFilter.jsx';
import CommunityList from '../ui/CommunityList.jsx';

export default function Community() {
  const [selectedJob, setSelectedJob] = useState('');
  const [communityData, setCommunityData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        jobCode: 'WD',
        question: "What is React?",
        answerText: "React is a UI library for building web apps.",
        score: 85
      },
      {
        id: 2,
        jobCode: 'DS',
        question: "Explain overfitting.",
        answerText: "Overfitting happens when a model memorizes training data.",
        score: 92
      },
    ];

    setCommunityData(mockData);
  }, []);

  return (
    <div className="page">
      <NavBar />

      <main style={{ width: 'min(960px, 92%)', margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Community</h1>

        <CommunityFilter 
          selectedJob={selectedJob}
          onChange={setSelectedJob}
        />

        <CommunityList 
          data={communityData}
          selectedJob={selectedJob}
        />
      </main>

      <Footer />
    </div>
  );
}