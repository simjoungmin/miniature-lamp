import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext'; // 장바구니 아이템 가져오기
import '../css/Bag.css';

const Bag = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  return (
    <div className="cartSection">
      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니에 담긴 아이템이 없습니다.</p>
      ) : (
        <ul className="cartItemList">
          {cartItems.map((item) => (
            <li key={item.id} className="cartItem">
              <div className="itemInfo">
                <p>{item.title.replace(/<[^>]*>?/gm, '')}</p>
                <p>{item.lprice}원</p>
                <p>수량: {item.quantity}</p>
              </div>
              <div className="quantityControls">
                <button
                  className="quantityButton"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <span className="quantityDisplay">{item.quantity}</span>
                <button
                  className="quantityButton"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>

              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100px' }}
              />
              <button
                className="deleteButton"
                onClick={() => removeFromCart(item.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bag;
