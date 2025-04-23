import React, { useEffect, useState } from "react";
import BasicLayout from "../../layout/BasicLayout";
import {
  fetchCartItems,
  removeCartItem,
  clearCartByMemberId,
  updateQuantity,
  deleteSelectedItems,
  addWishlistItem,
  addCartItem,
} from "../../api/cartApi";
import "../../static/css/cart.scss";

const CartPage = () => {
  const memberId = 1;
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  const dummyCartItem = {
    cartId: 999,
    itemId: 999,
    itemName: "임시 상품",
    price: 10000,
    qty: 2,
    imageFile: "/static/images/dummy_product.jpg",
    options: [
      { optionId: 1, size: "S" },
      { optionId: 2, size: "M" },
      { optionId: 3, size: "L" },
    ],
    selectedOptionId: 2,
  };

  const loadCartItems = async () => {
    try {
      const data = await fetchCartItems(memberId);
      const initialSizes = {};
      [dummyCartItem, ...data].forEach(item => {
        initialSizes[item.cartId] = item.selectedOptionId || (item.options && item.options[0]?.optionId);
      });
      setSelectedSizes(initialSizes);
      setCartItems([dummyCartItem, ...data]);
    } catch (error) {
      console.error("장바구니 불러오기 실패:", error);
      setCartItems([dummyCartItem]);
      setSelectedSizes({ [dummyCartItem.cartId]: dummyCartItem.selectedOptionId || (dummyCartItem.options && dummyCartItem.options[0]?.optionId) });
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const handleAllCheck = () => {
    setIsAllChecked(!isAllChecked);
    setCheckedItems(isAllChecked ? [] : cartItems.map((item) => item.cartId));
  };

  const handleSingleCheck = (cartId) => {
    setCheckedItems(
      checkedItems.includes(cartId)
        ? checkedItems.filter((id) => id !== cartId)
        : [...checkedItems, cartId]
    );
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
      await clearCartByMemberId(memberId);
      loadCartItems();
      setCheckedItems([]);
      setIsAllChecked(false);
      alert("장바구니 비움 완료");
    } catch (error) {
      console.error("장바구니 비우기 실패:", error);
    }
  };

  const handleSizeChange = (cartId, event) => {
    setSelectedSizes({ ...selectedSizes, [cartId]: parseInt(event.target.value) });
  };

  const handleQuantityChange = async (cartId, newQty) => {
    try {
      await updateQuantity(cartId, newQty);
      loadCartItems();
    } catch (error) {
      console.error("수량 변경 실패:", error);
    }
  };

  const increaseQuantity = (item) => {
    handleQuantityChange(item.cartId, item.qty + 1);
  };

  const decreaseQuantity = (item) => {
    if (item.qty > 1) {
      handleQuantityChange(item.cartId, item.qty - 1);
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

  const handleAddToWishlist = async (itemId) => {
    try {
      await addWishlistItem(memberId, itemId);
      alert("관심상품에 등록되었습니다.");
    } catch (error) {
      console.error("관심상품 등록 실패:", error);
      alert("관심상품 등록에 실패했습니다.");
    }
  };

  const handleSelectedOrder = () => {
    if (checkedItems.length > 0) {
      const selectedItems = cartItems.filter((item) => checkedItems.includes(item.cartId));
      const orderDetails = selectedItems.map(item => ({
        ...item,
        selectedOptionId: selectedSizes[item.cartId]
      }));
      console.log("선택 주문 상품:", orderDetails);
      alert("선택 주문 완료 (콘솔 로그 확인)");
    } else {
      alert("선택된 상품이 없습니다.");
    }
  };

  const handleAllOrder = () => {
    if (cartItems.length > 0) {
      const orderDetails = cartItems.map(item => ({
        ...item,
        selectedOptionId: selectedSizes[item.cartId]
      }));
      console.log("전체 주문 상품:", orderDetails);
      alert("전체 주문 완료 (콘솔 로그 확인)");
    } else {
      alert("장바구니에 상품이 없습니다.");
    }
  };

  const membershipRate = 0.03;
  const memberName = "홍길동";
  const membershipLevel = "GOLD";

  const totalPrice = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <BasicLayout>
      <div className="cartBox">
        <h1>CART</h1>
        <div className="membership">
          <div className="membershipLevel">{membershipLevel}</div>
          <p>
            {memberName}은 구매금액의 {membershipRate * 100}% 마일리지로 적립됩니다.
          </p>
        </div>
        <table className="cartTable">
          <thead className="menu">
            <tr>
              <th>
                <input type="checkbox" checked={isAllChecked} onChange={handleAllCheck} />
              </th>
              <th>상품</th>
              <th>단가</th>
              <th>수량</th>
              <th>사이즈</th>
              <th>주문금액</th>
              <th>적립금</th>
              <th>기타</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.cartId}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.cartId)}
                    onChange={() => handleSingleCheck(item.cartId)}
                  />
                </td>
                <td>
                  <div className="cartItem">
                    {item.imageFile && (
                      <img src={item.imageFile} alt={item.itemName} className="itemImage" />
                    )}
                    <span className="itemName">{item.itemName}</span>
                  </div>
                </td>
                <td>{item.price.toLocaleString()}원</td>
                <td>
                  <div className="quantityControl">
                    <button type="button" onClick={() => decreaseQuantity(item)}>-</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => increaseQuantity(item)}>+</button>
                  </div>
                </td>
                <td>
                  {item.options && item.options.length > 0 ? (
                    <select
                      value={selectedSizes[item.cartId] || item.options[0]?.optionId}
                      onChange={(event) => handleSizeChange(item.cartId, event)}
                      id={`size-${item.cartId}`}
                    >
                      {item.options.map((option) => (
                        <option key={option.optionId} value={option.optionId}>{option.size}</option>
                      ))}
                    </select>
                  ) : (
                    <span>옵션 없음</span>
                  )}
                </td>
                <td>{(item.price * item.qty).toLocaleString()}원</td>
                <td>{((item.price * item.qty) * membershipRate).toLocaleString()}원</td>
                <td>
                  <button onClick={() => handleAddToWishlist(item.itemId)}>관심상품 등록</button>
                  <button onClick={() => handleRemoveItem(item.cartId)}>카트에서 삭제</button>
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