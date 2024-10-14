import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Bag from '../pages/Bag';
import Share from '../pages/Share';
import cpu from '../images/cpu.png';
import mainboard from '../images/mainboard.png';
import memory from '../images/memory.png';
import graphiccard from '../images/graphiccard.png';
import power from '../images/power.png';
import pccase from '../images/case.png';
import ssd from '../images/ssd.png';
import hdd from '../images/hdd.png';
import cooler from '../images/cooler.png';
import '../css/Layout.css';
import MyPage from '../pages/MyPage';

/*  수정사항
   *   10/8 수정사항
        장바구니 메인에서 개수표시 -> 장바구니에 length 함수로 표현 (수정완)
        사양검토에서 사진 표시 -> 장바구니에서 대표 아이템만 보여주고 장바구니 전체 아이템의 수량을 표시함 & 문의 리스트에 사진 추가
        -> 컨텍스트의 카트아이템에서 인덱스 0번값을 활용하여 호출  -> 수정완
        Cpu 등 카테고리 페이지 들어갔을 때 장바구니 클릭 시 Api 검색값 안사라지고 같이 표현되는거 수정
        -> 카테고리와 하단 푸터 버튼들 동적페이지로 구성하여 로케이션 값 변경하지 않고 페이지 표기 -> 수정 완
        장바구니에 전체 리스트가 안보이고 하나만 보임
        -> 각각의 아이디값이 존재하지 않아 리랜더링이 안이루어짐
        -> 현재시각을 아이디값으로 지정해 아이디값에 따라 리랜더링하게 설정 -> 수정완
        api 검색값 product page Link 에서 동적페이지 구성으로 변환 완
   *  10/9 완성분에 대한 css 작업 완료
   *  10/10 동적페이지 구성 함수 if else 문에서 switch 문으로 변경
   *  10/10 memoization useMemo 통해
   *    1.검색 결과값 변하지 않으면 리랜더링 안하게 최적화
   *    2.장바구니 아이템 수량 체크와 장바구니 금액 합계도 장바구니의 아이템이 변해야 랜더링 하도록 변경
   *  10/10 useCallback 으로 handleAddToCart, handleCategorySelect 재사용
   *  10/10 관심상품 버튼 마이페이지 버튼으로 변경 -> 마이페이지 메인에 동적페이지 구성
   *  10/10 공유하기 url 링크 선택시 alert 추가하여 이용자에게 알림 추가하여 사용성 개선
   */

const Layout = () => {
  const { user } = useAuth(); // 전역 상태에서 로그인 정보 가져오기
  const { cartItems, totalPrice, clearCart, addToCart } =
    useContext(CartContext);
  const [currentCategory, setCurrentCategory] = useState(''); // 현재 선택된 카테고리 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isShareVisible, setIsShareVisible] = useState(false);

  // "이전으로" 버튼 클릭 시 홈으로 돌아가는 핸들러
  const handleGoBack = useCallback(() => {
    setCurrentCategory(''); // 카테고리 초기화
    setSearchResults([]); // 검색 결과 초기화
    setError(null); // 에러 초기화
    setLoading(false); // 로딩 상태 초기화
  }, []);

  // 초기화 버튼 클릭 핸들러
  const handleReset = useCallback(() => {
    if (window.confirm('초기화하시겠습니까?')) {
      clearCart();
    }
  }, [clearCart]);

  // 공유하기 컴포넌트 보이기
  const handleShareClick = useCallback(() => {
    setIsShareVisible(true);
  }, []);

  // 카테고리 선택 시 상태 업데이트 및 API 호출
  const handleCategorySelect = useCallback((category) => {
    setCurrentCategory(category); // 선택한 카테고리 상태로 설정
    fetchProductData(category); // API 호출
  }, []);

  // 검색 결과에서 장바구니에 아이템 추가하는 함수
  const handleAddToCart = useCallback(
    (item) => {
      addToCart(item); // 선택한 아이템을 장바구니에 추가
      alert(
        `${item.title.replace(/<[^>]*>?/gm, '')} 장바구니에 추가되었습니다!`,
      );
    },
    [addToCart],
  );

  // 총 아이템 개수 계산
  const ListItemCount = useMemo(() => cartItems.length, [cartItems]);

  // 바로구매 버튼 클릭 핸들러
  const handlePurchaseClick = useCallback(() => {
    if (!user) {
      if (window.confirm('로그인 후 이용이 가능합니다. 로그인하시겠습니까?')) {
        navigate('/login'); // 로그인 페이지로 이동
      }
    } else {
      navigate('/purchase'); // 바로구매 페이지로 이동
    }
  }, [user, navigate]);

  // 마이페이지 버튼 클릭 핸들러
  const handleMyPageClick = () => {
    if (!user) {
      if (window.confirm('로그인 후 이용이 가능합니다. 로그인하시겠습니까?')) {
        navigate('/login');
      }
    } else {
      setCurrentCategory('mypage');
    }
  };

  // API 호출
  const fetchProductData = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const clientId = 'hMdgE0nLXGeavMYiXrpD';
      const clientSecret = 'XCj2zvOYiD';
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(category)}`;

      const response = await fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      setError('제품 정보를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 조건부 렌더링으로 선택된 카테고리 또는 페이지 렌더링
  let content;

  switch (true) {
    case loading:
      content = <p>로딩 중...</p>;
      break;
    case !!error:
      content = <p>{error}</p>;
      break;
    case currentCategory === 'cart':
      content = <Bag />;
      break;
    case currentCategory === 'mypage':
      content = <MyPage />;
      break;
    case searchResults.length > 0:
      content = (
        <div className="productpage">
          <h2>
            {currentCategory.toUpperCase()} <span>검색 결과</span>
          </h2>
          <ul className="productList">
            {searchResults.map((item, index) => (
              <li key={index} className="productItem">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title.replace(/<[^>]*>?/gm, '')}
                </a>
                <p className="productPrice">가격: {item.lprice}원</p>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ maxWidth: '100px' }}
                />
                <button
                  className="addToCartButton"
                  onClick={() => handleAddToCart(item)}
                >
                  담기
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
      break;
    default:
      content = (
        <div>
          <ul>
            {[
              { img: cpu, name: 'CPU', key: 'cpu' },
              { img: mainboard, name: '메인보드', key: 'mainboard' },
              { img: memory, name: '메모리', key: 'memory' },
              { img: graphiccard, name: '그래픽카드', key: 'graphiccard' },
              { img: pccase, name: '케이스', key: 'case' },
              { img: power, name: '파워', key: 'power' },
              { img: ssd, name: 'SSD', key: 'ssd' },
              { img: hdd, name: 'HDD', key: 'hdd' },
              { img: cooler, name: 'CPU 쿨러', key: 'cooler' },
            ].map((category) => (
              <div className="middleitemFir" key={category.key}>
                <div
                  className="middleitemSec"
                  onClick={() => handleCategorySelect(category.key)}
                >
                  <img
                    src={category.img}
                    alt={category.name}
                    className="middleIcon"
                  />
                  <div className="qwe">
                    <p>
                      <strong>{category.name}</strong>를 선택하세요
                    </p>
                    <span className="middleArrow">→</span>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      );
      break;
  }

  return (
    <div className="layoutAll">
      <header className="layoutHeader">
        <nav>
          <div className="navFirstDiv">
            <div className="logo">
              {currentCategory ? (
                <p onClick={handleGoBack} style={{ cursor: 'pointer' }}>
                  이전으로
                </p>
              ) : (
                <p>직접 견적담기</p>
              )}
            </div>
            {!currentCategory && (
              <ul>
                <li onClick={handleReset}>
                  <p>초기화</p>
                </li>
                <li>
                  <span className="navStick">.</span>
                </li>
                <li>
                  <p onClick={handleShareClick}>견적공유</p>
                </li>
              </ul>
            )}
          </div>
        </nav>
        {/* 공유하기 */}
        {isShareVisible && (
          <>
            <div
              className="modal-overlay"
              onClick={() => setIsShareVisible(false)}
            />
            <div className="modal">
              <Share
                isVisible={isShareVisible}
                toggleShare={() => setIsShareVisible(false)}
              />
            </div>
          </>
        )}
      </header>

      <main className="list-container">{content}</main>

      <footer>
        <div className="bottomListUp">
          <div className="bottomUpReview">
            <p>
              <Link to="/review">사양검토</Link>
            </p>
          </div>
          <div className="bottomUpBag">
            <p onClick={() => handleCategorySelect('cart')}>
              장바구니 ({ListItemCount})
            </p>
          </div>
          <div className="bottomUpBuy">
            <p onClick={() => handleMyPageClick()}>마이페이지</p>
          </div>
        </div>
        <div className="bottomListDown">
          <div className="bottomDowncount">
            <p>
              {totalPrice.toLocaleString()}
              <span>원</span>
            </p>
          </div>
          <div className="bottomDownLogin">
            <p onClick={handlePurchaseClick}>바로구매</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default React.memo(Layout);
