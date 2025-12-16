import React from 'react';
import NavBar from '../components/common/NavBar.jsx';
import Footer from '../components/common/Footer.jsx';
import MyPageComponent from '../components/features/MyPage.jsx';

export default function MyPage() {
  return (
    <div className="page">
      <NavBar />
      <main>
        <MyPageComponent />
      </main>
      <Footer />
    </div>
  );
}

