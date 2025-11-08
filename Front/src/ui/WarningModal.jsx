import React from 'react';

export default function WarningModal({ onYes, onNo, onClose }) {
  const handleYes = () => {
    if (onYes) {
      onYes();
    }
  };

  const handleNo = () => {
    if (onNo) {
      onNo();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleNo}>
      <div className="modal-content warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="warning-icon-container">
          <div className="warning-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
        <div className="warning-modal-header">
          <button 
            className="warning-modal-close" 
            onClick={handleNo}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="warning-modal-content">
          <h2 className="warning-modal-title">꼭 읽어주세요!</h2>
          <div className="warning-modal-body">
            <p>JobReady 서비스는 회원가입을 제외하고 서비스 이용 중 일체의 개인정보를 사용할 필요 없습니다.</p>
            <p>이력서 제출하기 전 개인정보 보호를 위해 개인을 특정할 수 있는 사항들을 제거해주세요(사진, 주소, 이름, 전화번호 등)</p>
          </div>
          <div className="warning-modal-actions">
            <button className="btn btn-warning-outline" onClick={handleYes}>
              Yes
            </button>
            <button className="btn btn-warning" onClick={handleNo}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

