// 로컬 스토리지에 리뷰 데이터를 저장하는 함수
export const saveToLocalStorage = (reviews) => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  };
  
  // 로컬 스토리지에서 리뷰 데이터를 불러오는 함수
  export const loadFromLocalStorage = () => {
    const savedReviews = localStorage.getItem('reviews');
    return savedReviews ? JSON.parse(savedReviews) : [];
  };
  
  // 로컬 스토리지를 초기화하는 함수
  export const clearLocalStorage = () => {
    localStorage.removeItem('reviews');
    window.location.reload(); // 새로고침하여 초기화 적용
  };
  