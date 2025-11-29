import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 백엔드 API URL
const API_BASE_URL = 'https://jobready-backend-282796839955.asia-northeast3.run.app';

export default function UploadFile({ onClose }) {
  // localStorage에서 저장된 desiredJob을 기본값으로 사용
  const [files, setFiles] = useState([]);
  const [jobField, setJobField] = useState(() => {
    // 컴포넌트 마운트 시 localStorage에서 user_job_field 우선, 없으면 desiredJob 가져오기
    return localStorage.getItem('user_job_field') || localStorage.getItem('desiredJob') || '';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showQuestionLoadingModal, setShowQuestionLoadingModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const preparationIntervals = useRef({}); // 파일 준비 interval 추적

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = ['.pdf'];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 20MB를 초과할 수 없습니다.');
      return false;
    }
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(fileExtension)) {
      alert('지원되는 파일 형식:.pdf');
      return false;
    }
    
    return true;
  };

  const handleFileUpload = (uploadedFiles) => {
    const validFiles = Array.from(uploadedFiles).filter(validateFile);
    
    validFiles.forEach(file => {
      const fileId = Date.now() + Math.random();
      const newFile = {
        id: fileId,
        name: file.name,
        file: file, // 실제 File 객체 저장
        progress: 0,
        status: 'preparing' // preparing, ready, uploading, completed, error
      };
      
      setFiles(prev => [...prev, newFile]);
      
      // 파일 준비 진행률 시뮬레이션 (0% → 100%)
      simulateFilePreparation(fileId);
    });
  };

  const simulateFilePreparation = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (progress >= 100) {
            clearInterval(interval);
            delete preparationIntervals.current[fileId];
            return { ...file, progress: 100, status: 'ready' };
          }
          return { ...file, progress, status: 'preparing' };
        }
        return file;
      }));
    }, 100); // 100ms마다 10%씩 증가 (총 1초)
    
    // interval 추적
    preparationIntervals.current[fileId] = interval;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
  };

  const handleRemoveFile = (fileId) => {
    // 파일 준비 interval 정리
    if (preparationIntervals.current[fileId]) {
      clearInterval(preparationIntervals.current[fileId]);
      delete preparationIntervals.current[fileId];
    }
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleCreated = async () => {
    setError('');
    
    // 입력 검증
    if (files.length === 0) {
      setError('파일을 업로드해주세요.');
      return;
    }
    
    // user_id 확인
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setError('로그인이 필요합니다. 먼저 로그인해주세요.');
      return;
    }
    
    // 여러 파일이 있으면 첫 번째 파일만 업로드 (백엔드가 단일 파일만 받음)
    const fileToUpload = files[0];
    
    // 파일이 준비되지 않았으면 업로드 불가
    if (fileToUpload.status !== 'ready' || fileToUpload.progress !== 100) {
      setError('파일 준비가 완료되지 않았습니다. 잠시만 기다려주세요.');
      return;
    }
    
    // jobField가 없으면 localStorage에서 가져온 값 사용, 없으면 기본값 사용
    const finalJobField = jobField || localStorage.getItem('user_job_field') || localStorage.getItem('desiredJob') || '기타';
    
    setUploading(true);
    setFiles(prev => prev.map(file => 
      file.id === fileToUpload.id ? { ...file, status: 'uploading', progress: 0 } : file
    ));
    
    try {
      // FormData 생성 (서버 API 형식에 맞게)
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('job_field', finalJobField);
      formData.append('resume_file', fileToUpload.file);
      
      // XMLHttpRequest를 사용하여 업로드 진행률 추적
      const xhr = new XMLHttpRequest();
      
      // 업로드 진행률 추적
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          // 업로드 진행률을 0-90%로 설정 (나머지 10%는 서버 분석용)
          const uploadProgress = Math.round((e.loaded / e.total) * 90);
          setFiles(prev => prev.map(file => 
            file.id === fileToUpload.id ? { ...file, progress: uploadProgress, status: 'uploading' } : file
          ));
        }
      });
      
      // 응답 처리
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            // 업로드 완료 (90%)
            setFiles(prev => prev.map(file => 
              file.id === fileToUpload.id ? { ...file, progress: 90, status: 'uploading' } : file
            ));
            
            // 로딩 모달 표시 (분석 중)
            setShowLoadingModal(true);
            
            // 응답 데이터 파싱
            const data = JSON.parse(xhr.responseText);
            
            // 업로드 및 분석 완료 (100%)
            setFiles(prev => prev.map(file => 
              file.id === fileToUpload.id ? { ...file, status: 'completed', progress: 100 } : file
            ));
            
            // 분석 결과 저장
            setAnalysisResult(data);
            
            // localStorage에 선택한 직종 저장 (다음 업로드 시 기본값으로 사용)
            localStorage.setItem('desiredJob', finalJobField);
            
            // 로딩 모달 닫고 결과 모달 표시
            setShowLoadingModal(false);
            setShowResultModal(true);
            setUploading(false);
          } catch (parseError) {
            console.error('Response parse error:', parseError);
            setError('응답 데이터를 파싱하는 중 오류가 발생했습니다.');
            setFiles(prev => prev.map(file => 
              file.id === fileToUpload.id ? { ...file, status: 'error' } : file
            ));
            setUploading(false);
            setShowLoadingModal(false);
          }
        } else {
          // 에러 응답 처리
          try {
            const errorData = JSON.parse(xhr.responseText);
            setError(errorData.detail || errorData.message || '업로드에 실패했습니다.');
          } catch {
            setError('업로드에 실패했습니다.');
          }
          setFiles(prev => prev.map(file => 
            file.id === fileToUpload.id ? { ...file, status: 'error' } : file
          ));
          setUploading(false);
          setShowLoadingModal(false);
        }
      });
      
      // 에러 처리
      xhr.addEventListener('error', () => {
        console.error('Upload error');
        setError('업로드 중 오류가 발생했습니다.');
        setFiles(prev => prev.map(file => 
          file.id === fileToUpload.id ? { ...file, status: 'error' } : file
        ));
        setUploading(false);
        setShowLoadingModal(false);
      });
      
      // 중단 처리
      xhr.addEventListener('abort', () => {
        setError('업로드가 취소되었습니다.');
        setFiles(prev => prev.map(file => 
          file.id === fileToUpload.id ? { ...file, status: 'error' } : file
        ));
        setUploading(false);
        setShowLoadingModal(false);
      });
      
      // 요청 전송
      xhr.open('POST', `${API_BASE_URL}/api/resume/upload`);
      xhr.send(formData);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('업로드 중 오류가 발생했습니다.');
      setFiles(prev => prev.map(file => 
        file.id === fileToUpload.id ? { ...file, status: 'error' } : file
      ));
      setUploading(false);
      setShowLoadingModal(false);
    }
  };

  const handleResultConfirm = async () => {
    setShowResultModal(false);
    
    // user_id 확인
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setError('로그인이 필요합니다.');
      return;
    }
    
    // 질문 생성 로딩 모달 표시
    setShowQuestionLoadingModal(true);
    
    try {
      // 질문 생성 API 호출
      const response = await fetch(`${API_BASE_URL}/api/question/generate?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // 에러 응답 처리
        try {
          const errorData = await response.json();
          setError(errorData.detail || errorData.message || '질문 생성에 실패했습니다.');
        } catch {
          setError('질문 생성에 실패했습니다.');
        }
        setShowQuestionLoadingModal(false);
        return;
      }
      
      // 응답 데이터 파싱 (QuestionListResponse 형식)
      const questionData = await response.json();
      
      // 질문 리스트를 localStorage에 저장 (AiInterview 페이지에서 사용)
      localStorage.setItem('interview_questions', JSON.stringify(questionData.question_list));
      localStorage.setItem('analysis_summary', JSON.stringify(questionData.analysis_summary));
      
      // 질문 생성 완료
      setShowQuestionLoadingModal(false);
      
      // 모달 닫기
      if (onClose) {
        onClose();
      }
      
      // AiInterview 페이지로 이동
      navigate('/interview');
      
    } catch (err) {
      console.error('Question generation error:', err);
      setError('질문 생성 중 오류가 발생했습니다.');
      setShowQuestionLoadingModal(false);
    }
  };

  return (
    <div className="upload-file-container">
      <div className="upload-file-header">
        <div className="upload-file-header-content">
          <h2 className="upload-file-title">Add document</h2>
          <p className="upload-file-subtitle">여러분의 이력서를 올려주세요!</p>
        </div>
        <button 
          className="upload-file-close" 
          onClick={handleCancel}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          margin: '20px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: 6,
          fontSize: '.9rem',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <label htmlFor="job-field" style={{
          display: 'block',
          fontSize: '.9rem',
          fontWeight: 500,
          color: '#333',
          marginBottom: 6
        }}>
          희망 직종 *
        </label>
        <select
          id="job-field"
          value={jobField}
          onChange={(e) => setJobField(e.target.value)}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: 6,
            fontSize: '1rem',
            outline: 'none',
            background: 'transparent'
          }}
        >
          <option value="">직무를 선택하세요</option>
          <option value="개발 (프론트/백엔드)">개발 (프론트/백엔드)</option>
          <option value="디자인 (UI/UX)">디자인 (UI/UX)</option>
          <option value="기획 (PM/PO)">기획 (PM/PO)</option>
          <option value="영업/마케팅">영업/마케팅</option>
          <option value="경영지원/회계">경영지원/회계</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div
        className={`upload-file-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-file-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="upload-file-text">
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p className="upload-file-hint">
          Upload .PDF (MAX. file size 20mb)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>

      {files.length > 0 && (
        <div className="upload-file-list">
          {files.map((file) => (
            <div key={file.id} className="upload-file-item">
              <div className="upload-file-item-header">
                <div className="upload-file-item-info">
                  <svg className="upload-file-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span className="upload-file-item-name">{file.name}</span>
                </div>
                <button
                  className="upload-file-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
              <div className="upload-file-progress">
                <div className="upload-file-progress-bar">
                  <div
                    className="upload-file-progress-fill"
                    style={{ 
                      width: `${file.progress}%`,
                      backgroundColor: file.status === 'error' ? '#c33' : 
                                      file.status === 'completed' ? '#4caf50' : '#6C63FF'
                    }}
                  />
                </div>
                <span className="upload-file-progress-text">
                  {file.status === 'error' ? '업로드 실패' : 
                   file.status === 'completed' ? '완료' : 
                   file.status === 'ready' ? '준비 완료' :
                   file.status === 'uploading' ? `${file.progress}%` :
                   file.status === 'preparing' ? `준비 중... ${file.progress}%` :
                   `${file.progress}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="upload-file-actions">
        <button 
          className="btn btn-ghost" 
          onClick={handleCancel}
          disabled={uploading}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleCreated}
          disabled={uploading || files.length === 0 || (files.length > 0 && (files[0].status !== 'ready' || files[0].progress !== 100))}
          style={{ 
            opacity: (uploading || files.length === 0 || (files.length > 0 && (files[0].status !== 'ready' || files[0].progress !== 100))) ? 0.6 : 1,
            cursor: (uploading || files.length === 0 || (files.length > 0 && (files[0].status !== 'ready' || files[0].progress !== 100))) ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? '업로드 중...' : 
           files.length > 0 && files[0].status === 'preparing' ? '준비 중...' : 
           '업로드'}
        </button>
      </div>

      {/* 이력서 분석 로딩 모달 */}
      {showLoadingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #6C63FF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h3 style={{
              margin: '0 0 10px',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#333'
            }}>이력서 분석 중...</h3>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '0.95rem'
            }}>잠시만 기다려주세요. AI가 이력서를 분석하고 있습니다.</p>
          </div>
        </div>
      )}

      {/* 질문 생성 로딩 모달 */}
      {showQuestionLoadingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #6C63FF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h3 style={{
              margin: '0 0 10px',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#333'
            }}>맞춤 질문 생성 중...</h3>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '0.95rem'
            }}>이력서를 바탕으로 맞춤형 면접 질문을 생성하고 있습니다.</p>
          </div>
        </div>
      )}

      {/* 결과 모달 */}
      {showResultModal && analysisResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style={{
              margin: '0 0 15px',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#333'
            }}>이력서 분석 완료!</h3>
            <div style={{
              margin: '20px 0',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <p style={{
                margin: '0 0 10px',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: 500
              }}>직종: <span style={{ color: '#333' }}>{analysisResult.job_field}</span></p>
              <p style={{
                margin: '10px 0 0',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: 500
              }}>분석 키워드:</p>
              <p style={{
                margin: '5px 0 0',
                fontSize: '1rem',
                color: '#6C63FF',
                fontWeight: 500,
                lineHeight: '1.6'
              }}>{analysisResult.analysis_keywords}</p>
            </div>
            <button
              onClick={handleResultConfirm}
              style={{
                marginTop: '20px',
                padding: '12px 32px',
                backgroundColor: '#6C63FF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a52d5'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6C63FF'}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 로딩 애니메이션 스타일 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}