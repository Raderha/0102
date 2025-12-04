import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 백엔드 API URL
const API_BASE_URL = 'https://jobready-backend-282796839955.asia-northeast3.run.app';

export default function AiInterview() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // localStorage에서 질문 리스트 가져오기
  useEffect(() => {
    const savedQuestions = localStorage.getItem('interview_questions');
    if (savedQuestions) {
      try {
        const parsedQuestions = JSON.parse(savedQuestions);
        setQuestions(parsedQuestions);
      } catch (err) {
        console.error('Failed to parse questions:', err);
      }
    }
  }, []);

  // CSS 애니메이션 추가
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      // 컴포넌트 언마운트 시 스타일 제거
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  // 현재 질문 (질문 리스트가 있으면 첫 번째 질문, 없으면 기본 메시지)
  const question = questions.length > 0 
    ? questions[currentQuestionIndex] 
    : "질문을 생성하기 위해 먼저 이력서를 업로드해주세요.";

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 오디오 파일만 허용 (mp3, wav, m4a, ogg, webm)
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/m4a', 'audio/webm', 'video/webm'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'webm'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        alert('지원되는 파일 형식: .mp3, .wav, .m4a, .ogg, .webm');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('답변 파일을 선택해주세요.');
      return;
    }

    if (questions.length === 0) {
      alert('질문이 없습니다.');
      return;
    }

    // user_id 확인
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // question_index 확인
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
      alert('질문 인덱스가 유효하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    setShowLoadingModal(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('question_index', currentQuestionIndex.toString());
      formData.append('audio_file', selectedFile);
      formData.append('user_id', userId);

      // API 호출
      const response = await fetch(`${API_BASE_URL}/api/interview/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || '면접 분석에 실패했습니다.');
      }

      const data = await response.json();
      
      // 서버로부터 받은 데이터를 콘솔에 출력
      console.log('서버 응답 데이터:', data);

      // 응답 데이터를 localStorage에 저장 (ScoreBoard에서 사용)
      localStorage.setItem('interview_analysis_result', JSON.stringify(data));

      // 로딩 모달 닫기
      setShowLoadingModal(false);
      setIsSubmitting(false);

      // ScoreBoard로 이동
      navigate('/scoreboard');

    } catch (error) {
      console.error('면접 분석 오류:', error);
      alert(error.message || '면접 분석 중 오류가 발생했습니다.');
      setShowLoadingModal(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>JobReady - AI 면접 시뮬레이션</h1>
        <p style={styles.subtitle}>
          이력서와 직종을 바탕으로 생성된 맞춤형 면접 질문에 답변해주세요.
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.questionSection}>
          <div style={styles.questionHeader}>
            <div style={styles.questionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 style={styles.sectionTitle}>면접 질문</h2>
          </div>
          <div style={styles.questionBox}>
            {questions.length > 0 ? (
              <>
                <p style={styles.questionText}>{question}</p>
                {questions.length > 1 && (
                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '20px',
                    borderTop: `1px solid ${theme.border}`
                  }}>
                    <span style={{
                      fontSize: '0.9rem',
                      color: theme.textLight
                    }}>
                      질문 {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: currentQuestionIndex === 0 ? theme.background : theme.white,
                          color: currentQuestionIndex === 0 ? theme.textLight : theme.textDark,
                          cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}
                      >
                        이전
                      </button>
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        disabled={currentQuestionIndex === questions.length - 1}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: currentQuestionIndex === questions.length - 1 ? theme.background : theme.white,
                          color: currentQuestionIndex === questions.length - 1 ? theme.textLight : theme.textDark,
                          cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme.textLight
              }}>
                <p style={{
                  fontSize: '1.1rem',
                  margin: '0 0 10px',
                  color: theme.textLight
                }}>
                  질문이 아직 생성되지 않았습니다.
                </p>
                <p style={{
                  fontSize: '0.95rem',
                  margin: 0,
                  color: theme.textLight
                }}>
                  이력서를 업로드하고 분석을 완료하면 맞춤형 면접 질문이 생성됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.answerSection}>
          <div style={styles.answerHeader}>
            <div style={styles.answerIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h2 style={styles.sectionTitle}>답변 녹음</h2>
          </div>
          
          <div style={styles.fileInputArea}>
            <div style={styles.fileInputWrapper}>
              <button
                type="button"
                onClick={handleFileSelect}
                style={styles.fileSelectButton}
                aria-label="파일 선택"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={styles.fileInfo}>
                {selectedFile ? (
                  <div style={styles.selectedFile}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span style={styles.fileName}>{selectedFile.name}</span>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      style={styles.removeFileButton}
                      aria-label="파일 제거"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="당신의 답변을 녹음해서 제출해주세요"
                    style={styles.placeholderInput}
                    readOnly
                    onClick={handleFileSelect}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isSubmitting || questions.length === 0}
          style={{
            ...styles.submitButton,
            opacity: (!selectedFile || isSubmitting || questions.length === 0) ? 0.6 : 1,
            cursor: (!selectedFile || isSubmitting || questions.length === 0) ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              제출 중...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              제출
            </>
          )}
        </button>
      </div>

      {/* 로딩 모달 */}
      {showLoadingModal && (
        <div style={styles.loadingModal}>
          <div style={styles.loadingModalContent}>
            <div style={styles.loadingSpinner}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 style={styles.loadingTitle}>면접 분석 중...</h3>
            <p style={styles.loadingText}>음성 파일을 분석하고 피드백을 생성하고 있습니다.</p>
            <p style={styles.loadingSubtext}>잠시만 기다려주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const theme = {
  primary: '#6C63FF',
  secondary: '#2F80ED',
  textDark: '#333',
  textLight: '#666',
  white: '#fff',
  border: '#e0e0e0',
  background: '#f8f9fa',
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: theme.white,
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: theme.textDark,
    margin: '0 0 16px 0',
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: theme.textLight,
    margin: 0,
    lineHeight: 1.6,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    marginBottom: '40px',
  },
  questionSection: {
    backgroundColor: theme.background,
    borderRadius: '16px',
    padding: '32px',
    border: `1px solid ${theme.border}`,
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  questionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: theme.primary,
    color: theme.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  answerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: theme.secondary,
    color: theme.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.textDark,
    margin: 0,
  },
  questionBox: {
    backgroundColor: theme.white,
    borderRadius: '12px',
    padding: '24px',
    border: `2px solid ${theme.primary}`,
    borderLeft: `6px solid ${theme.primary}`,
  },
  questionText: {
    fontSize: '1.25rem',
    color: theme.textDark,
    margin: 0,
    lineHeight: 1.8,
    fontWeight: 500,
  },
  answerSection: {
    backgroundColor: theme.background,
    borderRadius: '16px',
    padding: '32px',
    border: `1px solid ${theme.border}`,
  },
  fileInputArea: {
    marginTop: '16px',
  },
  fileInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: theme.white,
    borderRadius: '12px',
    padding: '16px',
    border: `2px solid ${theme.border}`,
    transition: 'border-color 0.2s',
  },
  fileSelectButton: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: theme.primary,
    color: theme.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
  },
  placeholderInput: {
    width: '100%',
    padding: '12px 0',
    border: 'none',
    borderBottom: `2px solid ${theme.border}`,
    fontSize: '1rem',
    outline: 'none',
    color: theme.textLight,
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  selectedFile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
  },
  fileName: {
    flex: 1,
    fontSize: '1rem',
    color: theme.textDark,
    fontWeight: 500,
  },
  removeFileButton: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fee',
    color: '#c33',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: 1,
    padding: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '24px',
    borderTop: `1px solid ${theme.border}`,
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: theme.white,
    background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
  },
  loadingModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingModalContent: {
    backgroundColor: theme.white,
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    color: theme.primary,
  },
  loadingTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.textDark,
    margin: '0 0 12px 0',
  },
  loadingText: {
    fontSize: '1rem',
    color: theme.textLight,
    margin: '0 0 8px 0',
    lineHeight: 1.6,
  },
  loadingSubtext: {
    fontSize: '0.9rem',
    color: theme.textLight,
    margin: 0,
  },
};

