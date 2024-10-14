import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // 페이지 로드 시 LocalStorage 에서 장바구니 정보를 불러옴
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // 장바구니 총 금액
  const [totalPrice, setTotalPrice] = useState(0);

  // 장바구니에 아이템 추가 함수
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id,
      );
      if (existingItem) {
        // 이미 있는 아이템이면 수량만 증가
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      // 새 아이템에 Date.now()로 고유한 id 부여 후 추가
      return [...prevItems, { ...item, id: Date.now(), quantity: 1 }];
    });
  };

  // 장바구니에서 수량 증가 함수
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  // 장바구니에서 수량 감소 함수
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  // 장바구니에서 아이템 삭제 함수
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 장바구니 초기화 함수
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); // LocalStorage에서도 장바구니 정보 삭제
  };

  // 장바구니 총 금액 계산 함수
  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartItems.reduce(
        (sum, item) => sum + item.lprice * item.quantity,
        0,
      );
      setTotalPrice(total);
    };

    calculateTotalPrice(); // cartItems 변경될 때마다 총 금액 계산
  }, [cartItems]);

  // 장바구니 상태가 변경될 때 LocalStorage 에 저장
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 장바구니 상태와 함수들을 context 로 제공
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
