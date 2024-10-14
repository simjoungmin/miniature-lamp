import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 로그인 정보 관리

const LoginCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const getAccessTokenAndUserInfo = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const platform = urlParams.get('platform'); // 'naver' 또는 'kakao'
      const code = urlParams.get('code'); // 카카오와 네이버의 code 값을 받아옴
      console.log('Code:', code);

      try {
        if (platform === 'kakao') {
          const tokenResponse = await fetch(
            'https://kauth.kakao.com/oauth/token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: '9a6e95427a81d9b3ae61176476fbdb22',
                redirect_uri:
                  'http://localhost:3000/login/callback?platform=kakao',
                code,
              }),
            },
          );

          const tokenData = await tokenResponse.json();
          console.log('Kakao token data:', tokenData);

          if (tokenData.access_token) {
            const userInfoResponse = await fetch(
              'https://kapi.kakao.com/v2/user/me',
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${tokenData.access_token}`,
                },
              },
            );

            const userInfo = await userInfoResponse.json();
            console.log('Kakao user info:', userInfo);

            const user = {
              name: userInfo.kakao_account.profile.nickname,
              email: userInfo.kakao_account.email,
            };

            login(user);
            navigate('/');
          } else {
            throw new Error('카카오 로그인 실패');
          }
        } else if (platform === 'naver') {
          const accessToken = urlParams.get('access_token');
          const userInfoResponse = await fetch(
            'https://openapi.naver.com/v1/nid/me',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const userInfo = await userInfoResponse.json();
          console.log('Naver user info:', userInfo);

          const user = {
            name: userInfo.response.name,
            email: userInfo.response.email,
          };

          login(user);
          navigate('/');
        }
      } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
      }
    };

    getAccessTokenAndUserInfo();
  }, [login, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default LoginCallback;
