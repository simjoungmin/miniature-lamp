import React, { createContext, useState, useContext, useEffect } from 'react';

// 로그인 정보를 담을 Context 생성
const AuthContext = createContext(null);

// AuthContext 를 제공하는 Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보를 상태로 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태 관리

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 로그인 상태를 확인
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // 로그인 함수
  const login = (userInfo) => {
    setUser(userInfo); // 사용자 정보를 상태에 저장
    localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태를 로컬 스토리지에 저장
    setIsLoggedIn(true); // 로그인 상태 업데이트
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null); // 사용자 정보 제거
    localStorage.removeItem('isLoggedIn'); // 로컬 스토리지에서 로그인 상태 제거
    setIsLoggedIn(false); // 로그인 상태 업데이트
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context 를 쉽게 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
