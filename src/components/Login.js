import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Login.css';

function Login() {
  const { login } = useAuth(); // AuthContext 에서 login 함수 가져오기
  const navigate = useNavigate();

  // 네이버 로그인 초기화
  useEffect(() => {
    if (typeof window.naver !== 'undefined') {
      const naverLoginInit = () => {
        const clientId = 'hMdgE0nLXGeavMYiXrpD'; // 네이버 클라이언트 ID
        const redirectURI =
          'http://localhost:3000/login/callback?platform=naver'; // 콜백 URL

        const naverLogin = new window.naver.LoginWithNaverId({
          clientId,
          callbackUrl: redirectURI,
          isPopup: false,
          loginButton: { color: 'green', type: 3, height: 60 },
        });

        naverLogin.init();
        naverLogin.getLoginStatus((status) => {
          if (status) {
            const user = {
              name: naverLogin.user.getName(),
              email: naverLogin.user.getEmail(),
            };
            login(user); // 로그인 처리
            navigate('/review'); // 로그인 후 리뷰 페이지로 이동
          }
        });
      };
      naverLoginInit();
    }
  }, [login, navigate]);

  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init('9a6e95427a81d9b3ae61176476fbdb22'); // 카카오 앱 키
    }

    kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/login/callback?platform=kakao',
    });

    kakao.Auth.login({
      success: (authObj) => {
        kakao.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const user = {
              name: res.kakao_account.profile.nickname,
              email: res.kakao_account.email,
            };
            login(user); // 로그인 처리
            navigate('/review'); // 로그인 후 리뷰 페이지로 이동
          },
        });
      },
    });
  };

  return (
    <div className="loginContainer">
      <div className="loginlist">
        <h2>소셜 로그인만 가능합니다</h2>
        <div id="naverIdLogin" className="socialLoginButton" />
        <li onClick={handleKakaoLogin} className="socialLoginButtonkakao" />
      </div>
    </div>
  );
}

export default Login;
