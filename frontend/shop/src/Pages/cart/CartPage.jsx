import React, { useState } from "react";
import BasicLayout from "../../layout/BasicLayout";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            itemId : 1,
            item_name: "블루 스프링 집업",
            image: "",
            price: 25000,
            qty: 2,
        },
        {
            itemId : 2,
            item_name: "화이트 코튼 티셔츠",
            image: "",
            price: 15000,
            qty: 1,
        },
    ]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);

    const handleAllCheck = () => {
        if (isAllChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems(cartItems.map(item => item.itemId));
        }
        setIsAllChecked(!isAllChecked);
    };

    const handleSingleCheck = (itemId) => {
        if (checkedItems.includes(itemId)) {
            setCheckedItems(checkedItems.filter((checkedId) => checkedId !== itemId));
        } else {
            setCheckedItems([...checkedItems, itemId]);
        }
    };

    const handleSelectDelete = () => {
        if (checkedItems.length > 0) {
            const updatedCartItems = cartItems.filter(item => !checkedItems.includes(item.itemId));
            setCartItems(updatedCartItems);
            setCheckedItems([]);
            setIsAllChecked(false);
            console.log("선택 삭제 완료:", checkedItems);
        } else {
            alert("선택된 상품이 없습니다.");
        }
    };

    const handleQuantityChange = (itemId, qty) => {
        setCartItems(cartItems.map(item =>
            item.itemId === itemId ? { ...item, qty: parseInt(qty, 10) || 1 } : item
        ));
    };

    const handleRemoveItem = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
    };

    const handleClearCart = () => {
        setCartItems([]);
        setCheckedItems([]);
        setIsAllChecked(false);
        alert("장바구니를 비웠습니다.");
    };

    const handleSelectedOrder = () => {
        if (checkedItems.length > 0) {
            const selectedItems = cartItems.filter(item => checkedItems.includes(item.itemId));
            console.log("선택 주문 상품:", selectedItems);
            alert("선택하신 상품 주문");
        } else {
            alert("선택된 상품이 없습니다.");
        }
    };

    const handleAllOrder = () => {
        if (cartItems.length > 0) {
            console.log("전체 주문 상품:", cartItems);
            alert("전체 상품 주문");
        } else {
            alert("장바구니에 상품이 없습니다.");
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + ((item.price) * (item.qty)), 0);

    
    return (
        <BasicLayout>
        <div className="cartBox">
            <h1>CART</h1>

            <div className="membership">
                {membershipLevel}
                <p>{memberName}은 구매금액의 {membershipRate * 100 }% 마일리지로 적립 됩니다.</p>
            </div>

            <table className="cartTable">
                <thead className="menu">
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={isAllChecked}
                                onChange={handleAllCheck}
                            />
                        </th>
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
                        <tr key={item.itemId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={checkedItems.includes(item.itemId)}
                                    onChange={() => handleSingleCheck(item.itemId)}
                                />
                            </td>
                            <td>{item.item_name}</td>
                            <td>{item.price.toLocaleString()}원</td>
                            <td>
                                <input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => handleQuantityChange(item.itemId, e.target.value)}
                                    min="1"
                                />
                            </td>
                            <td>{(item.price * item.qty).toLocaleString()}원</td>
                            <td>{((item.price * item.qty) * membershipRate).toLocaleString()}원</td>
                            <td>
                                <button onClick={() => handleRemoveItem(item.itemId)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cartButtons">
                <div className="leftButtons">
                    <label>
                        <input
                            type="checkbox"
                            checked={isAllChecked}
                            onChange={handleAllCheck}
                        />
                        전체선택
                    </label>
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