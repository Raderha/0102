import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import Footer from '../components/common/Footer.jsx';
import UploadFile from '../components/features/UploadFile.jsx';

export default function UploadFilePage() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <UploadFile />
      </main>
      <Footer />
    </div>
  );
}

