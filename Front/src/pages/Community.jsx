import React, { useState, useEffect } from 'react';
import NavBar from '../ui/NavBar.jsx';
import Footer from '../ui/Footer.jsx';
import Community from '../ui/Community.jsx';
import axios from "axios";

export default function CommunityPage() {
  const [selectedJob, setSelectedJob] = useState('');
  const [communityData, setCommunityData] = useState([]);
  
  // 백엔드 API URL (환경 변수에서 가져오기)
  // 개발 환경에서는 프록시를 사용하므로 빈 문자열, 프로덕션에서는 전체 URL 사용
  const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://jobready-backend-282796839955.asia-northeast3.run.app');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // TODO: 모든 면접 기록을 가져오는 API 엔드포인트 필요
        // 현재는 Mock 데이터 사용 (실제 API 연결 시 수정 필요)
        // const res = await axios.get(`${API_BASE_URL}/api/community/posts`);
        // setCommunityData(res.data.records || []);
        
        // 임시: 빈 배열로 설정 (실제 API 연결 시 위 코드 사용)
        setCommunityData([]);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        setCommunityData([]);
      }
    };

    fetchPosts();
  }, [API_BASE_URL]);

  return (
    <div className="page">
      <NavBar />

      <main style={{ width: 'min(960px, 92%)', margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Community</h1>

        <Community 
          selectedJob={selectedJob}
          onJobChange={setSelectedJob}
          communityData={communityData}
        />
      </main>

      <Footer />
    </div>
  );
}