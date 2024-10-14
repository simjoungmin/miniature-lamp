import React, { useContext } from 'react';
import '../css/Share.css';
import kakao from '../images/kakao.png';
import url from '../images/url.png';
import { CartContext } from '../contexts/CartContext';

const Share = ({ isVisible, toggleShare }) => {
  const { cartItems } = useContext(CartContext);

  const handleCopyUrl = () => {
    // 장바구니 데이터를 URL 에 포함
    const cartData = encodeURIComponent(JSON.stringify(cartItems));
    const shareURL = `${window.location.origin}?cart=${cartData}`;

    navigator.clipboard
      .writeText(shareURL)
      .then(() => {
        alert('링크가 복사되었습니다!');
      })
      .catch((err) => {
        console.error('URL 복사 실패: ', err);
      });
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init('9a6e95427a81d9b3ae61176476fbdb22'); // 카카오 앱 키
    }

    kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/login/callback?platform=kakao',
    });
  };

  return (
    // 윗단
    <div className={`shareAll ${isVisible ? 'active' : ''}`}>
      <div className="mainbox">
        <div className="shareUp">
          <p>공유하기</p>
          <button onClick={toggleShare}>x</button>
        </div>
        <hr />

        {/* 아랫단 카카오*/}
        <div className="shareDown">
          <div className="shareDownxBox">
            <button onClick={handleKakaoLogin} className="shareButton">
              <img src={kakao} alt="KakaoTalk" className="kakaoLogo" />
            </button>

            {/* URL 복사 */}
            <button onClick={handleCopyUrl} className="shareButton">
              <img src={url} alt="URL 복사" className="kakaoLogo" />
            </button>
          </div>
        </div>
        <div className="downText">
          <p>
            카카오톡<span>링크 복사하기</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Share;
