import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/MyPage.css';

const MyPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div>
        <p>로그인되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="logoutLeft">
        <h2>마이페이지</h2>
        <button className="logoutButton" onClick={logout}>
          로그아웃
        </button>
      </div>
      <div className="userInfo">
        <p>
          <span>이름:</span> {user.name}
        </p>
        <p>
          <span>이메일:</span> {user.email}
        </p>
      </div>
    </div>
  );
};

export default MyPage;
