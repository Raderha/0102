import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function Community({ selectedJob, onJobChange, communityData }) {
  // 필터링된 데이터
  const filteredData = selectedJob
    ? communityData.filter(d => d.job_field === selectedJob)
    : communityData;

  return (
    <>
      {/* 필터 섹션 */}
      <JobFilter selectedJob={selectedJob} onChange={onJobChange} />

      {/* 리스트 섹션 */}
      <div style={{ marginTop: 20 }}>
        {filteredData.length === 0 && (
          <div style={{ padding: 20, color: "#777" }}>
            등록된 게시글이 없습니다.
          </div>
        )}

        {filteredData.map((post, index) => (
          <CommunityItem 
            key={post.post_id || post.interview_id || index} 
            item={post} 
          />
        ))}
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
    <div style={filterStyles.wrapper}>
      <label style={filterStyles.label}>Filter by Job Category</label>
      <select
        value={selectedJob}
        onChange={(e) => onChange(e.target.value)}
        style={filterStyles.select}
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
    return item.transcribed_text || item.answerText || item.answer || '';
  };

  const score = getScore();
  const answer = getAnswer();

  return (
    <article style={itemStyles.card}>
      <div style={itemStyles.row} onClick={() => setOpen(!open)}>
        <strong style={itemStyles.question}>{item.question}</strong>
        <span style={itemStyles.arrow}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={itemStyles.detail}>
          {score !== null && (
            <p style={itemStyles.score}>
              <strong>점수:</strong> {score}점 / 5점
            </p>
          )}
          {answer && (
            <div style={itemStyles.answer}>
              <strong>답변:</strong>
              <p style={itemStyles.answerText}>{answer}</p>
            </div>
          )}
          {item.feedback && (
            <div style={itemStyles.feedback}>
              {item.feedback.relevance_score !== undefined && (
                <p style={itemStyles.feedbackItem}>
                  <strong>관련성 점수:</strong> {item.feedback.relevance_score}점 / 5점
                </p>
              )}
              {item.feedback.logic_score !== undefined && (
                <p style={itemStyles.feedbackItem}>
                  <strong>논리성 점수:</strong> {item.feedback.logic_score}점 / 5점
                </p>
              )}
              {item.feedback.improvement_advice && (
                <p style={itemStyles.feedbackItem}>
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

// 필터 스타일
const filterStyles = {
  wrapper: {
    margin: '20px 0 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 15,
    color: '#475467',
    fontWeight: 600,
  },
  select: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #d0d5dd',
    background: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// 아이템 스타일
const itemStyles = {
  card: {
    padding: 18,
    borderRadius: 14,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
    marginBottom: 16,
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    fontSize: 16,
    fontWeight: 700,
    color: '#333',
    flex: 1,
  },
  arrow: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 12,
    color: '#5b5ce2',
  },
  detail: {
    marginTop: 14,
    paddingTop: 14,
    borderTop: '1px solid #e5e7eb',
    color: '#475467',
    lineHeight: '1.6',
  },
  score: {
    marginBottom: 12,
    fontSize: 15,
    color: '#5b5ce2',
    fontWeight: 600,
  },
  answer: {
    marginBottom: 12,
  },
  answerText: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  feedback: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid #e5e7eb',
  },
  feedbackItem: {
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
  },
};
