import React, { useState, useEffect, useCallback } from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Community from '../components/features/Community.jsx';
import '../styles/Pages.css';

export default function CommunityPage() {
  const [selectedJob, setSelectedJob] = useState('');
  const [communityData, setCommunityData] = useState([]);
  
  // 백엔드 API URL (환경 변수에서 가져오기)
  // 개발 환경에서는 프록시를 사용하므로 빈 문자열, 프로덕션에서는 전체 URL 사용
  const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://jobready-backend-282796839955.asia-northeast3.run.app');

  // 데이터 가져오기 함수 (useCallback으로 메모이제이션)
  const fetchPosts = useCallback(async () => {
    try {
      // 개발 환경에서는 프록시를 통해 /api/board로 요청
      // 프로덕션에서는 전체 URL 사용
      const apiUrl = `${API_BASE_URL}/api/board/`;
      console.log('API 호출 시작:', apiUrl);
      console.log('개발 환경 여부:', import.meta.env.DEV);
      console.log('API_BASE_URL:', API_BASE_URL);
      
      // 캐시 방지를 위해 timestamp 추가
      const timestamp = new Date().getTime();
      const urlWithCache = `${apiUrl}?t=${timestamp}`;
      
      const response = await fetch(urlWithCache, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      console.log('응답 데이터 타입:', typeof data, Array.isArray(data));
      
      // API 응답은 JSON 배열 형태로 직접 반환됨
      let posts = [];
      if (Array.isArray(data)) {
        posts = data;
      } else if (data && Array.isArray(data.records)) {
        posts = data.records;
      } else if (data && Array.isArray(data.data)) {
        posts = data.data;
      }
      
      console.log('최종 설정할 데이터:', posts);
      console.log('게시글 개수:', posts.length);
      setCommunityData(posts);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      console.error("에러 메시지:", error.message);
      setCommunityData([]);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 가져오기
    fetchPosts();
    
    // 페이지 포커스 시 데이터 새로고침 (다른 탭에서 돌아왔을 때)
    const handleFocus = () => {
      console.log('페이지 포커스 - 데이터 새로고침');
      fetchPosts();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchPosts]);

  return (
    <div className="page">
      <NavBar />

      <main className="page-main">
        <h1 className="page-title">Community</h1>

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