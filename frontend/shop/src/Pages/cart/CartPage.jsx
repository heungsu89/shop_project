import React, { useState } from "react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      item_id: 111,
      item_name: "블루 스프링 집업",
      image: "",
      price: "",
      quantity: "",
    },
  ]);

  const handleQuantityChange = (item_id, quantity) => {
    // 수량 변경 
  };

  const handleRemoveItem = (item_id) => {
    // 아이템 삭제 
  };

  return (
    <div className="cartBox">
      <h1>CART</h1>

      <div className="membership">
        {membershipLevel}
        <p>{memberName}은 구매금액의 {membershipRate}% 마일리지로 적립 됩니다.</p>
      </div>

      <thead className="menu">
        <tr>
          <th>상품</th>
          <th>단가</th>
          <th>주문금액</th>
          <th>적립금</th>
          <th>기타</th>
        </tr>
      </thead>

      <tbody>
      </tbody>

      <div className="cartButtons">
        <div className="leftButtons">
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={handleAllCheck}
          />
          <label>전체선택</label>
          <button onClick={handleSelectDelete}>선택삭제</button>
          <button onClick={handleClearCart}>장바구니 비우기</button>
        </div>

        <div className="rightButtons">
          <button onClick={handleSelectedOrder}>선택주문</button>
          <button onClick={handleAllOrder}>
            전체주문 (₩{totalPrice.toLocaleString()})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
