import React, { useEffect, useState } from "react";
import BasicLayout from "../../layout/BasicLayout";
import { fetchCartItems, removeCartItem, clearCart, updateQuantity, deleteSelectedItems } from "../../api/cartApi";
import "../../static/css/cart.scss";

const CartPage = () => {
  const memberId = 1; // 임시값
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const loadCartItems = async () => {
    try {
      const data = await fetchCartItems(memberId);
      setCartItems(data);
    } catch (error) {
      console.error("장바구니 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const handleAllCheck = () => {
    if (isAllChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartItems.map(item => item.cartId));
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleSingleCheck = (cartId) => {
    if (checkedItems.includes(cartId)) {
      setCheckedItems(checkedItems.filter(id => id !== cartId));
    } else {
      setCheckedItems([...checkedItems, cartId]);
    }
  };

  const handleSelectDelete = async () => {
    if (checkedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    try {
      await deleteSelectedItems(checkedItems);
      loadCartItems();
      setCheckedItems([]);
      setIsAllChecked(false);
      alert("선택 항목 삭제 완료");
    } catch (error) {
      console.error("선택 삭제 실패:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(memberId);
      loadCartItems();
      setCheckedItems([]);
      setIsAllChecked(false);
      alert("장바구니 비움 완료");
    } catch (error) {
      console.error("장바구니 비우기 실패:", error);
    }
  };

  const handleQuantityChange = async (cartId, newQty) => {
    try {
      await updateQuantity(cartId, parseInt(newQty, 10) || 1);
      loadCartItems();
    } catch (error) {
      console.error("수량 변경 실패:", error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeCartItem(cartId);
      loadCartItems();
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  };

  const handleSelectedOrder = () => {
    if (checkedItems.length > 0) {
      const selectedItems = cartItems.filter(item => checkedItems.includes(item.cartId));
      console.log("선택 주문 상품:", selectedItems);
      alert("선택 주문 완료");
    } else {
      alert("선택된 상품이 없습니다.");
    }
  };

  const handleAllOrder = () => {
    if (cartItems.length > 0) {
      console.log("전체 주문 상품:", cartItems);
      alert("전체 주문 완료");
    } else {
      alert("장바구니에 상품이 없습니다.");
    }
  };

  const membershipRate = 0.03; // 임시 더미데이터
  const memberName = "홍길동";
  const membershipLevel = "GOLD";

  const totalPrice = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <BasicLayout>
      <div className="cartBox">
        <h1>CART</h1>

        <div className="membership">
          <div className="membershipLevel">{membershipLevel}</div>
          <p>{memberName}은 구매금액의 {membershipRate * 100}% 마일리지로 적립됩니다.</p>
        </div>

        <table className="cartTable">
          <thead className="menu">
            <tr>
              <th><input type="checkbox" checked={isAllChecked} onChange={handleAllCheck} /></th>
              <th>상품</th>
              <th>단가</th>
              <th>수량</th>
              <th>주문금액</th>
              <th>적립금</th>
              <th>기타</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.cartId}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.cartId)}
                    onChange={() => handleSingleCheck(item.cartId)}
                  />
                </td>
                <td>{item.itemName}</td>
                <td>{item.price.toLocaleString()}원</td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.cartId, e.target.value)}
                  />
                </td>
                <td>{(item.price * item.qty).toLocaleString()}원</td>
                <td>{((item.price * item.qty) * membershipRate).toLocaleString()}원</td>
                <td>
                  <button onClick={() => handleRemoveItem(item.cartId)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cartButtons">
          <div className="leftButtons">
            <button onClick={handleAllCheck} className="allSelectBtn">
              전체선택
            </button>
            <button onClick={handleSelectDelete}>선택삭제</button>
            <button onClick={handleClearCart}>장바구니 비우기</button>
          </div>

          <div className="rightButtons">
            <button onClick={handleSelectedOrder}>선택주문</button>
            <button onClick={handleAllOrder}>
              전체주문 ({totalPrice.toLocaleString()}원)
            </button>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default CartPage;