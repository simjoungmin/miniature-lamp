import React, { useState } from 'react';
import '../css/ReviewListItem.css';

function ReviewListItem({ review, index, onDelete, onEdit, onAddComment }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(review.title);
  const [editedContent, setEditedContent] = useState(review.content);
  const [newComment, setNewComment] = useState('');

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(review.id, editedTitle, editedContent);
    }
    setIsEditing((prev) => !prev);
  };

  const handleDelete = () => onDelete(review.id);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(review.id, newComment);
      setNewComment('');
    }
  };

  const renderCartItems = () => {
    if (Array.isArray(review.cartItems)) {
      return review.cartItems.join(', ');
    }
    return review.cartItems || '장바구니에 아이템이 없습니다.';
  };

  return (
    <li className={`list-item ${isOpen ? 'open' : ''}`}>
      <div className="review-header" onClick={toggleOpen}>
        <h3>
          {index + 1}. {review.title}
        </h3>
      </div>

      {isOpen && (
        <div className="popup-box">
          <button className="close-button" onClick={toggleOpen}>
            &times;
          </button>
          <div className="popup-content">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </>
            ) : (
              <>
                <p>{review.content}</p>
                <small>장바구니 아이템: {renderCartItems()}</small>
              </>
            )}

            <div className="button-group">
              <button onClick={handleEdit}>
                {isEditing ? '저장' : '수정'}
              </button>
              <button onClick={handleDelete}>삭제</button>
            </div>

            <div className="comment-section">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
              />
              <button onClick={handleAddComment}>댓글 추가</button>

              <ul>
                {review.comments.map((comment, idx) => (
                  <li key={idx}>{comment}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export default ReviewListItem;
