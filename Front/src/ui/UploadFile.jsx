import React, { useState, useRef } from 'react';

export default function UploadFile({ onClose }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = ['.txt', '.docx', '.pdf'];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 20MB를 초과할 수 없습니다.');
      return false;
    }
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(fileExtension)) {
      alert('지원되는 파일 형식: .txt, .docx, .pdf');
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
        progress: 0,
        status: 'uploading'
      };
      
      setFiles(prev => [...prev, newFile]);
      
      // 업로드 진행률 시뮬레이션
      simulateUpload(fileId);
    });
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, progress: 100, status: 'completed' } : file
        ));
      } else {
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, progress: Math.round(progress) } : file
        ));
      }
    }, 200);
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

  const handleCreated = () => {
    if (files.length === 0) {
      alert('파일을 업로드해주세요.');
      return;
    }
    // 여기에 실제 업로드 로직 추가
    console.log('Files to upload:', files);
    alert('파일이 성공적으로 업로드되었습니다.');
    if (onClose) {
      onClose();
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
          Upload .txt, .docx, PDF (MAX. file size 20mb)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.docx,.pdf"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
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
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                <span className="upload-file-progress-text">{file.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="upload-file-actions">
        <button className="btn btn-ghost" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleCreated}>
          Created
        </button>
      </div>
    </div>
  );
}

