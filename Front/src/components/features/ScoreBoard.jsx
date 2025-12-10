import React, { useState, useEffect } from 'react'
import '../../styles/ScoreBoard.css'

function ScoreBoard() {
  const [totalScore, setTotalScore] = useState(0) // 5점 만점 종합 점수
  const [questionScore, setQuestionScore] = useState(0) // 질문 답변 점수 (relevance_score)
  const [resumeScore, setResumeScore] = useState(0) // 이력서 점수 (logic_score)
  const [transcribedText, setTranscribedText] = useState('')
  const [feedback, setFeedback] = useState('')

  // 도넛 차트 계산
  const scorePercentage = (totalScore / 5) * 100
  const circumference = 2 * Math.PI * 60 // 반지름 60
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference

  useEffect(() => {
    // localStorage에서 면접 분석 결과 가져오기
    const analysisResult = localStorage.getItem('interview_analysis_result');
    
    if (analysisResult) {
      try {
        const data = JSON.parse(analysisResult);
        
        // transcribed_text 설정
        if (data.transcribed_text) {
          setTranscribedText(data.transcribed_text);
        }
        
        // feedback 설정
        if (data.feedback) {
          const feedbackText = data.feedback.improvement_advice || '';
          setFeedback(feedbackText);
          
          // 점수 설정
          const relevanceScore = data.feedback.relevance_score || 0;
          const logicScore = data.feedback.logic_score || 0;
          
          setQuestionScore(relevanceScore);
          setResumeScore(logicScore);
          
          // 종합 점수 계산 (relevance_score와 logic_score의 평균)
          const avgScore = (relevanceScore + logicScore) / 2;
          setTotalScore(avgScore);
        }
      } catch (error) {
        console.error('면접 분석 결과 파싱 오류:', error);
        // 기본값 유지
        setTranscribedText('질문에 대한 답변 음성 파일이 텍스트로 변환된 내용이 여기에 표시됩니다...');
        setFeedback('답변에 대한 피드백이 여기에 표시됩니다. 강점과 개선점에 대한 상세한 분석이 제공됩니다...');
      }
    } else {
      // 데이터가 없을 경우 기본값
      setTranscribedText('질문에 대한 답변 음성 파일이 텍스트로 변환된 내용이 여기에 표시됩니다...');
      setFeedback('답변에 대한 피드백이 여기에 표시됩니다. 강점과 개선점에 대한 상세한 분석이 제공됩니다...');
    }
  }, [])

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <h1>Score Board</h1>
      </div>

      {/* 상단 카드들 - 일렬 배치 */}
      <div className="top-cards-row">
        {/* 빨간색 카드 - Relevance Score */}
        <div className="stat-card red-card">
          <div className="card-content">
            <h3 className="card-title">Relevance Score</h3>
            <div className="card-value">{questionScore.toFixed(1)} / 5.0</div>
            <p className="card-subtitle">답변의 질문 관련성 점수입니다. (1~5점)</p>
          </div>
          <div className="card-icon">📝</div>
        </div>

        {/* 보라색 카드 - Logic Score */}
        <div className="stat-card purple-card">
          <div className="card-content">
            <h3 className="card-title">Logic Score</h3>
            <div className="card-value">{resumeScore.toFixed(1)} / 5.0</div>
            <p className="card-subtitle">답변의 논리성 점수입니다. (1~5점)</p>
          </div>
          <div className="card-icon">📄</div>
        </div>

        {/* 종합 점수 그래프 */}
        <div className="score-chart-card">
          <h3 className="chart-title">종합 점수 그래프(5점 만점)</h3>
          <div className="chart-container">
            <svg className="donut-chart" width="140" height="140">
              <circle
                className="donut-ring"
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="12"
              />
              <circle
                className="donut-segment"
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="chart-center">
              <div className="chart-score">{totalScore.toFixed(1)}</div>
              <div className="chart-label">Out of 5.0</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot purple-dot"></span>
              <span>Relevance: {questionScore.toFixed(1)}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot blue-dot"></span>
              <span>Logic: {resumeScore.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 텍스트 박스들 - 세로 배치 */}
      <div className="bottom-text-boxes">
        {/* 1번 텍스트 박스: 음성 파일 텍스트 */}
        <div className="text-box">
          <h3 className="text-box-title">TRANSCRIBED ANSWERS / 생성된 질문에 사용자님이 답변하신 내용입니다</h3>
          <div className="text-box-content">
            <textarea
              readOnly
              value={transcribedText}
              className="text-area"
              placeholder="질문에 대한 답변 음성 파일이 텍스트로 변환된 내용이 여기에 표시됩니다..."
            />
          </div>
        </div>

        {/* 2번 텍스트 박스: 피드백 */}
        <div className="text-box">
          <h3 className="text-box-title">FEEDBACK</h3>
          <div className="text-box-content">
            <textarea
              readOnly
              value={feedback}
              className="text-area"
              placeholder="답변에 대한 피드백이 여기에 표시됩니다..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreBoard
