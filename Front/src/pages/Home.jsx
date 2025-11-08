import React, { useState } from 'react';
import NavBar from '../ui/NavBar.jsx';
import Hero from '../ui/Hero.jsx';
import Features from '../ui/Features.jsx';
import Footer from '../ui/Footer.jsx';
import UploadFile from '../ui/UploadFile.jsx';
import WarningModal from '../ui/WarningModal.jsx';
import Login from '../ui/Login.jsx';
import Register from '../ui/Register.jsx';
import FindPW from '../ui/FindPW.jsx';

export default function Home() {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFindPWModalOpen, setIsFindPWModalOpen] = useState(false);

  const openWarningModal = () => setIsWarningModalOpen(true);
  const closeWarningModal = () => setIsWarningModalOpen(false);
  
  const openUploadModal = () => {
    closeWarningModal();
    setIsUploadModalOpen(true);
  };
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsFindPWModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsFindPWModalOpen(false);
    setIsRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openFindPWModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsFindPWModalOpen(true);
  };
  const closeFindPWModal = () => setIsFindPWModalOpen(false);

  return (
    <div className="page">
      <NavBar 
        onOpenUploadModal={openWarningModal}
        onOpenLoginModal={openLoginModal}
        onOpenRegisterModal={openRegisterModal}
      />
      <main>
        <Hero onOpenUploadModal={openWarningModal} />
        <Features />
      </main>
      <Footer />
      {isWarningModalOpen && (
        <WarningModal 
          onYes={openUploadModal}
          onNo={closeWarningModal}
          onClose={closeWarningModal}
        />
      )}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={closeUploadModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UploadFile onClose={closeUploadModal} />
          </div>
        </div>
      )}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <Login 
              onClose={closeLoginModal}
              onOpenRegister={openRegisterModal}
              onOpenFindPW={openFindPWModal}
            />
          </div>
        </div>
      )}
      {isRegisterModalOpen && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <Register 
              onClose={closeRegisterModal}
              onOpenLogin={openLoginModal}
            />
          </div>
        </div>
      )}
      {isFindPWModalOpen && (
        <div className="modal-overlay" onClick={closeFindPWModal}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <FindPW 
              onClose={closeFindPWModal}
              onOpenLogin={openLoginModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}


