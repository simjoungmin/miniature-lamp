import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReviewFormPage from '../pages/ReviewFormPage';
import ReviewListPage from '../pages/ReviewListPage';
import { v4 as uuidv4 } from 'uuid';
import '../css/Review.css';

const generateDummyReviews = () =>
  Array.from({ length: 300 }, (_, index) => ({
    id: uuidv4(),
    sequence: 300 - index,
    title: `문의글 ${300 - index}`,
    content: `이것은 ${300 - index}번째 더미 데이터입니다.`,
    cartItems: 'CPU, GPU, RAM',
    comments: [],
    isAuthor: Math.random() > 0.5,
  }));

function Review() {
  const { isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const listRef = useRef(null);

  useEffect(() => {
    const dummyReviews = generateDummyReviews();
    setReviews(dummyReviews);
  }, []);

  const handleNewReview = (title, content, cartItems) => {
    const newReview = {
      id: uuidv4(),
      sequence: reviews.length + 1,
      title,
      content,
      cartItems,
      comments: [],
      isAuthor: true,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const handleAddComment = (reviewId, comment) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId
        ? { ...review, comments: [...review.comments, comment] }
        : review,
    );
    setReviews(updatedReviews);
  };

  const handleEditReview = (id, updatedTitle, updatedContent) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id
        ? { ...review, title: updatedTitle, content: updatedContent }
        : review,
    );
    setReviews(updatedReviews);
  };

  const handleDeleteReview = (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.recomputeRowHeights();
    }
  }, [reviews]);

  return (
    <div className="review-container">
      <div className="review-header1">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button
          onClick={() =>
            isLoggedIn ? setShowForm((prev) => !prev) : navigate('/login')
          }
        >
          문의하기
        </button>
      </div>

      {showForm && <ReviewFormPage onSubmit={handleNewReview} />}

      <ReviewListPage
        reviews={reviews}
        setReviews={setReviews}
        listRef={listRef}
        onAddComment={handleAddComment}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview} // 추가된 부분
      />
    </div>
  );
}

export default Review;
