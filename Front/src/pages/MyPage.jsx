import React from 'react';
import NavBar from '../ui/NavBar.jsx';
import MyPageComponent from '../ui/MyPage.jsx';
import Footer from '../ui/Footer.jsx';

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

