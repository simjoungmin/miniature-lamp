import React, { useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import '../css/ReviewFormPage.css';

// HTML 태그를 제거하는 함수
const stripHtml = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

function ReviewFormPage({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { cartItems } = useContext(CartContext); // 장바구니 아이템 가져오기

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (title.trim() && content.trim()) {
      // 장바구니 아이템을 문자열로 변환하고 HTML 태그 제거
      const cartItemsText = cartItems
        .map((item) =>
          stripHtml(`${item.name || item.title} (${item.quantity}개)`),
        )
        .join(', ');

      onSubmit(title, content, cartItemsText); // 폼 데이터 제출
      setTitle('');
      setContent('');
    }
  };

  return (
    <form className="review-form" onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="input-title"
      />

      {/* 장바구니 아이템 표시 */}
      <div className="cart-box">
        <h3>장바구니에 담긴 아이템:</h3>
        <pre className="cart-items-text">
          {cartItems
            .map((item) =>
              stripHtml(`${item.name || item.title} (${item.quantity}개)`),
            )
            .join('\n')}
        </pre>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
        className="textarea-content"
      />
      <button type="submit" className="submit-button">
        제출하기
      </button>
    </form>
  );
}

export default ReviewFormPage;
