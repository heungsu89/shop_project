import axios from "axios";
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/cart/`;
const WISHLIST_HOST = `${API_SERVER_HOST}/api/wish/add`;

export const fetchCartItems = async (memberId) => {
  try {
    const response = await axios.get(`${host}${memberId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 조회 실패:", error);
    throw error;
  }
};

export const addCartItem = async (memberId, itemId, optionId, qty) => {
  try {
    const response = await axios.post(`${host}add/${memberId}`, { itemId, optionId, qty });
    return response.data;
  } catch (error) {
    console.error("장바구니 등록 실패:", error);
    throw error;
  }
};

export const clearCartByMemberId = async (memberId) => {
  try {
    await axios.delete(`${host}${memberId}`);
  } catch (error) {
    console.error("회원 ID 기준 장바구니 삭제 실패:", error);
    throw error;
  }
};

export const deleteSelectedItems = async (cartIds) => {
  try {
    await axios.delete(`${host}multipleDelete`, { data: cartIds });
  } catch (error) {
    console.error("선택 삭제 실패:", error);
    throw error;
  }
};

export const removeCartItem = async (cartId) => {
  try {
    await axios.delete(`${host}deleteItem`, { data: { cartId } });
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    throw error;
  }
};

export const updateQuantity = async (cartItemId, qty) => {
  try {
    await axios.put(`${host}update/${cartItemId}`, { qty });
  } catch (error) {
    console.error("수량 변경 실패:", error);
    throw error;
  }
};

export const addWishlistItem = async (memberId, itemId) => {
  try {
    await axios.post(WISHLIST_HOST, { memberId, itemId });
  } catch (error) {
    console.error("관심상품 등록 실패:", error);
    throw error;
  }
};