import React, { useState, useRef } from 'react';

export default function AiInterview() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const question = "동기 처리와 비동기 처리의 차이점은 무엇인가요?";

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 오디오 파일만 허용 (mp3, wav, m4a, ogg)
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/m4a'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['mp3', 'wav', 'm4a', 'ogg'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        alert('지원되는 파일 형식: .mp3, .wav, .m4a, .ogg');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('답변 파일을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // 서버 연동은 나중에 구현
    setTimeout(() => {
      alert('답변이 제출되었습니다!');
      setIsSubmitting(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000);
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
            <p style={styles.questionText}>{question}</p>
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
                accept="audio/*,.mp3,.wav,.m4a,.ogg"
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
          disabled={!selectedFile || isSubmitting}
          style={{
            ...styles.submitButton,
            opacity: (!selectedFile || isSubmitting) ? 0.6 : 1,
            cursor: (!selectedFile || isSubmitting) ? 'not-allowed' : 'pointer',
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
};

