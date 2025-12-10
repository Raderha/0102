import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../styles/Community.css';

export default function Community({ selectedJob, onJobChange, communityData }) {
  // 디버깅 로그
  console.log('Community 컴포넌트 렌더링:', {
    communityDataLength: communityData?.length,
    communityData,
    selectedJob
  });

  // 필터링된 데이터 (job_field로 필터링)
  const filteredData = selectedJob
    ? communityData.filter(d => {
        // job_field가 문자열로 오는 경우와 코드로 오는 경우 모두 처리
        const jobField = d.job_field || '';
        return jobField === selectedJob || jobField.includes(selectedJob);
      })
    : communityData;

  console.log('필터링된 데이터:', filteredData.length, '개');

  return (
    <>
      {/* 필터 섹션 */}
      <JobFilter selectedJob={selectedJob} onChange={onJobChange} />

      {/* 리스트 섹션 */}
      <div className="community-list">
        {!communityData || communityData.length === 0 ? (
          <div className="community-empty">
            등록된 게시글이 없습니다.
          </div>
        ) : filteredData.length === 0 ? (
          <div className="community-empty">
            선택한 필터에 해당하는 게시글이 없습니다.
          </div>
        ) : (
          filteredData.map((post, index) => (
            <CommunityItem 
              key={post.post_id || post.interview_id || index} 
              item={post} 
            />
          ))
        )}
      </div>
    </>
  );
}

// 필터 컴포넌트
function JobFilter({ selectedJob, onChange }) {
  const jobCategories = [
    { code: 'WD', name: 'Web Developer' },
    { code: 'DS', name: 'Data Scientist' },
    { code: 'PM', name: 'Product Manager' },
    { code: 'UX', name: 'UX Designer' },
    { code: 'SE', name: 'Sales Engineer' },
    { code: 'AC', name: 'Accountant' },
  ];

  return (
    <div className="community-filter-wrapper">
      <label className="community-filter-label">Filter by Job Category</label>
      <select
        value={selectedJob}
        onChange={(e) => onChange(e.target.value)}
        className="community-filter-select"
      >
        <option value="">All</option>
        {jobCategories.map((job) => (
          <option key={job.code} value={job.code}>
            {job.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// 개별 아이템 컴포넌트
function CommunityItem({ item }) {
  const [open, setOpen] = useState(false);

  // item이 없으면 렌더링하지 않음
  if (!item) {
    console.warn('CommunityItem: item이 없습니다');
    return null;
  }

  // 점수 계산 (relevance_score + logic_score의 평균 또는 총합)
  const getScore = () => {
    if (item.feedback) {
      const relevance = item.feedback.relevance_score || 0;
      const logic = item.feedback.logic_score || 0;
      return Math.round((relevance + logic) / 2); // 평균 점수
    }
    // 기존 데이터 구조 지원
    if (item.score !== undefined) {
      return item.score;
    }
    return null;
  };

  // 답변 텍스트 가져오기
  const getAnswer = () => {
    return item.answer || item.transcribed_text || item.answerText || '';
  };

  const score = getScore();
  const answer = getAnswer();
  const question = item.question || '질문 없음';

  return (
    <article className="community-item-card">
      <div className="community-item-row" onClick={() => setOpen(!open)}>
        <strong className="community-item-question">{question}</strong>
        <span className="community-item-arrow">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="community-item-detail">
          {/* 작성자 정보 */}
          {/* {item.writer_name && (
            <p className="community-item-meta">
              <strong>작성자:</strong> {item.writer_name}
            </p>
          )} */}
          {/* 직종 정보 */}
          {item.job_field && (
            <p className="community-item-meta">
              <strong>직종:</strong> {item.job_field}
            </p>
          )}
          {/* 조회수 */}
          {/* {item.views !== undefined && (
            <p className="community-item-meta">
              <strong>조회수:</strong> {item.views}
            </p>
          )} */}
          {/* 작성일 */}
          {item.created_at && (
            <p className="community-item-meta">
              <strong>작성일:</strong> {new Date(item.created_at).toLocaleString('ko-KR')}
            </p>
          )}
          {/* 점수 (기존 feedback 구조 지원) */}
          {score !== null && (
            <p className="community-item-score">
              <strong>점수:</strong> {score}점 / 5점
            </p>
          )}
          {/* 답변 */}
          {answer && (
            <div className="community-item-answer">
              <strong>답변:</strong>
              <p className="community-item-answer-text">{answer}</p>
            </div>
          )}
          {/* 피드백 요약 (새로운 API 구조) */}
          {item.feedback_summary && (
            <div className="community-item-feedback">
              <p className="community-item-feedback-item">
                <strong>피드백 요약:</strong> {item.feedback_summary}
              </p>
            </div>
          )}
          {/* 상세 피드백 (기존 구조 지원) */}
          {item.feedback && (
            <div className="community-item-feedback">
              {item.feedback.relevance_score !== undefined && (
                <p className="community-item-feedback-item">
                  <strong>관련성 점수:</strong> {item.feedback.relevance_score}점 / 5점
                </p>
              )}
              {item.feedback.logic_score !== undefined && (
                <p className="community-item-feedback-item">
                  <strong>논리성 점수:</strong> {item.feedback.logic_score}점 / 5점
                </p>
              )}
              {item.feedback.improvement_advice && (
                <p className="community-item-feedback-item">
                  <strong>개선 사항:</strong> {item.feedback.improvement_advice}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
