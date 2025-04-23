import axios from "axios";
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/cart/`;

// 장바구니 불러오기
export const fetchCartItems = async (memberId) => {
    try {
        const response = await axios.get(`${host}${memberId}`);
        return response.data;
    } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
        throw error;
    }
};

// 장바구니 항목 삭제
export const removeCartItem = async (cartId) => {
    try {
        await axios.delete(`${host}delete/${cartId}`);
    } catch (error) {
        console.error("상품 삭제 실패:", error);
        throw error;
    }
};

// 장바구니 비우기
export const clearCart = async (memberId) => {
    try {
        await axios.delete(`${host}clear/${memberId}`);
    } catch (error) {
        console.error("장바구니 비우기 실패:", error);
        throw error;
    }
};

// 수량 변경
export const updateQuantity = async (cartId, qty) => {
    try {
        await axios.put(`${host}update/${cartId}`, { qty });
    } catch (error) {
        console.error("수량 변경 실패:", error);
        throw error;
    }
};

// 선택된 항목 삭제
export const deleteSelectedItems = async (checkedItems) => {
    try {
        await Promise.all(
            checkedItems.map(cartId => axios.delete(`${host}delete/${cartId}`))
        );
    } catch (error) {
        console.error("선택 삭제 실패:", error);
        throw error;
    }
};
