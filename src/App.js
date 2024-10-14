import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';
import LoginCallback from './pages/LoginCallback';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import React from 'react';
import Purchase from './pages/purchase';
import Review from './components/Review';

function App() {
  return (
    <AuthProvider>
      {' '}
      <CartProvider>
        {' '}
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/callback" element={<LoginCallback />} />{' '}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/review" element={<Review />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
