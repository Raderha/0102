import React from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import MyPageComponent from '../components/features/MyPage.jsx';
import Footer from '../components/layout/Footer.jsx';

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

