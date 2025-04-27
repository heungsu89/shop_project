import axios from "axios";
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const CART_HOST = `${API_SERVER_HOST}/api/cart`;
const WISHLIST_HOST = `${API_SERVER_HOST}/api/wish/add`;

export const fetchCartItems = async (memberId) => {
  try {
    const response = await axios.get(`${CART_HOST}/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 조회 실패:", error);
    throw error;
  }
};

export const addCartItem = async (cartData) => {
  try {
    const response = await axios.post(`${CART_HOST}/add`, cartData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("장바구니 등록 실패:", error);
    throw error;
  }
};

export const clearCartByMemberId = async (memberId) => {
  try {
    await axios.delete(`${CART_HOST}/${memberId}`);
  } catch (error) {
    console.error("회원 ID 기준 장바구니 삭제 실패:", error);
    throw error;
  }
};

export const deleteSelectedItems = async (cartIds) => {
  try {
    await axios.delete(`${CART_HOST}/multipleDelete`, { data: cartIds });
  } catch (error) {
    console.error("선택 삭제 실패:", error);
    throw error;
  }
};

export const removeCartItem = async (cartId) => {
  try {
    await axios.delete(`${CART_HOST}/deleteItem`, { data: { cartId } });
  } catch (error) {
    console.error("상품 삭제 실패:", error);
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

// 장바구니 카트
export const updateQty = async (optionId, changeQty) => {
  console.log(optionId,changeQty)
  const response = await axios.post(`${CART_HOST}/updateQty`, null, {
    params: {
      optionId: optionId,
      changeQty: changeQty
    }
  });
  return response.data;
};

// 장바구니 수량 수정
export const updateCartQty = async (cartId, newQty) => {
  const response = await axios.post(`${CART_HOST}/updateCartQty`, null, {
    params: {
      cartId: cartId,
      newQty: newQty
    }
  });
  return response.data;
};

export const selectItems = async (data) =>{
  try{
    const res = await axios.post(`${CART_HOST}/getSelectList`);
    console.log("선택 상품 옵션별 : " + res.data)
    return res.data;
  }catch(error){
    throw error;
  }
}

