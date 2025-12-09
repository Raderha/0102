import React, { useState, useEffect } from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import CommunityFilter from '../ui/CommunityFilter.jsx';
import CommunityList from '../ui/CommunityList.jsx';
import axios from "axios";

export default function Community() {
  const [selectedJob, setSelectedJob] = useState('');
  const [communityData, setCommunityData] = useState([]);

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://jobready-backend-282796839955.asia-northeast3.run.app");
      console.log("서버에서 받은 데이터:", res.data);
      setCommunityData(res.data);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  fetchPosts();
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