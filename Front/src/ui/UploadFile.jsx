import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 백엔드 API URL
const API_BASE_URL = 'https://jobready-backend-282796839955.asia-northeast3.run.app';

export default function UploadFile({ onClose }) {
  // localStorage에서 저장된 desiredJob을 기본값으로 사용
  const [files, setFiles] = useState([]);
  const [jobField, setJobField] = useState(() => {
    // 컴포넌트 마운트 시 localStorage에서 desiredJob 가져오기
    return localStorage.getItem('desiredJob') || '';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
        status: 'pending' // pending, uploading, completed, error
      };
      
      setFiles(prev => [...prev, newFile]);
    });
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
    
    if (!jobField) {
      setError('희망 직종을 선택해주세요.');
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
    
    setUploading(true);
    setFiles(prev => prev.map(file => 
      file.id === fileToUpload.id ? { ...file, status: 'uploading', progress: 0 } : file
    ));
    
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('job_field', jobField);
      formData.append('resume_file', fileToUpload.file);
      
      // XMLHttpRequest를 사용하여 진행률 추적
      const xhr = new XMLHttpRequest();
      
      // 진행률 업데이트
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => prev.map(file => 
            file.id === fileToUpload.id ? { ...file, progress } : file
          ));
        }
      });
      
      // 업로드 완료 처리
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            
            // 업로드 성공
            setFiles(prev => prev.map(file => 
              file.id === fileToUpload.id ? { ...file, status: 'completed', progress: 100 } : file
            ));
            
            // localStorage에 선택한 직종 저장 (다음 업로드 시 기본값으로 사용)
            localStorage.setItem('desiredJob', jobField);
            
            // 성공 메시지
            alert('이력서 업로드가 완료되었습니다!');
            
            // 모달 닫기
            if (onClose) {
              onClose();
            }
            
            // AiInterview 페이지로 이동
            navigate('/interview');
          } catch (parseError) {
            console.error('Response parse error:', parseError);
            setError('서버 응답을 처리할 수 없습니다.');
            setFiles(prev => prev.map(file => 
              file.id === fileToUpload.id ? { ...file, status: 'error' } : file
            ));
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
        }
        setUploading(false);
      });
      
      // 에러 처리
      xhr.addEventListener('error', () => {
        setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        setFiles(prev => prev.map(file => 
          file.id === fileToUpload.id ? { ...file, status: 'error' } : file
        ));
        setUploading(false);
      });
      
      // 업로드 시작
      xhr.open('POST', `${API_BASE_URL}/api/resume/upload`);
      xhr.send(formData);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('업로드 중 오류가 발생했습니다.');
      setFiles(prev => prev.map(file => 
        file.id === fileToUpload.id ? { ...file, status: 'error' } : file
      ));
      setUploading(false);
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

      {/* <div style={{ padding: '0 20px', marginBottom: '20px' }}>
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
      </div> */}

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
          disabled={uploading || files.length === 0 || !jobField}
          style={{ 
            opacity: (uploading || files.length === 0 || !jobField) ? 0.6 : 1,
            cursor: (uploading || files.length === 0 || !jobField) ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      </div>
    </div>
  );
}