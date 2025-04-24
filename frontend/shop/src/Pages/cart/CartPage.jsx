import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {fetchCartItems,removeCartItem,clearCartByMemberId,updateQuantity,deleteSelectedItems,addWishlistItem,addCartItem,} from "../../api/cartApi";
import { getCookie } from "../../util/cookieUtil";
import BasicLayout from "../../layout/BasicLayout";
import "../../static/css/cart.scss";

const CartPage = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';
  const [memberInfo, setMemberInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  const loadCartItems = async () => {
    try {
      const data = await fetchCartItems(loginState.memberId);
      const initialSizes = {};
      data.forEach(item => {
        initialSizes[item.cartId] = item.selectedOptionId || (item.options && item.options[0]?.optionId);
      });
      setSelectedSizes(initialSizes);
      setCartItems(data);
    } catch (error) {
      console.error("장바구니 불러오기 실패:", error);
      setCartItems([]);
      setSelectedSizes({});
    }
  };


  useEffect(() => {
    if (isLoggedIn) {
      const info = getCookie("member");
      setMemberInfo(info);
      loadCartItems();
    } else {
      setMemberInfo(null);
    }
  }, [isLoggedIn, loginState.memberId]);


  console.log(cartItems)


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
        <h2>CART</h2>
        <div className="membership">
          <div className="membershipLevel">{membershipLevel}</div>
          <p>
            {memberName}은 구매금액의 {membershipRate * 100}% 마일리지로 적립됩니다.
          </p>
        </div>
        <div className="tablePage">
        <div className="itemTableWrap">
          <table className="itemTable">
            <thead className="itemThead">
              <tr className="itemTr">
                <th className="itemNumber"><input type="checkbox" checked={isAllChecked} onChange={handleAllCheck} /></th>
                <th className="itemInfo">상품</th>
                <th className="itemPriceInfo">단품가격</th>
                <th className="itemPriceInfo">주문금액</th>
                <th className="itemPriceInfo">적립금</th>
                <th className="itemWriter">기타</th>
              </tr>
            </thead>
          <tbody className="itemTbody">
          {cartItems.map((item) => (
            <tr className="itemTr" key={item.cartId}>
              <td className="itemNumber">
                <input type="checkbox" checked={checkedItems.includes(item.cartId)} onChange={() => handleSingleCheck(item.cartId)}/>
              </td>
              <td className="itemInfo">
                {item.imageName && (
                <div className="itemImg">
                  <img src={`http://localhost:8081/upload/${item.imageName}`} alt={item.itemName} className="itemImage" />
                </div>
                )}
              <div className="itemDetailInfo">
                <span className="itemName">{item.itemName}</span>
                <span>{item.optionName} : {item.optionValue} </span>
                <div className="quantityControl">
                  <button type="button" onClick={() => decreaseQuantity(item)}>-</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => increaseQuantity(item)}>+</button>
                </div>
              </div>

              {/* {item.options && item.options.length > 0 ? (
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
              )} */}
              </td>
              <td className="itemPriceInfo">{item.itemPrice.toLocaleString()}원</td>
              <td className="itemPriceInfo">{(item.itemPrice * item.qty).toLocaleString()}원</td>
              <td className="itemPriceInfo">{((item.itemPrice * item.qty) * membershipRate).toLocaleString()}원</td>
              <td className="itemWriter">
                <button onClick={() => handleAddToWishlist(item.itemId)}>관심상품 등록</button>
                <button onClick={() => handleRemoveItem(item.cartId)}>카트에서 삭제</button>
              </td>
            </tr>
          ))}
          </tbody>
          </table>
        </div>
        </div>
        <div className="cartButtons">
          <div className="leftButtons">
            <button onClick={handleAllCheck} className="btn black">
              전체선택
            </button>
            <button onClick={handleSelectDelete} className="btn gray">선택삭제</button>
            <button onClick={handleClearCart} className="btn gray">장바구니 비우기</button>
          </div>
          <div className="rightButtons">
            <button onClick={handleSelectedOrder} className="btn line bigBtn">선택주문</button>
            <button onClick={handleAllOrder} className="btn black bigBtn">
              전체주문 ({totalPrice.toLocaleString()}원)
            </button>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default CartPage;