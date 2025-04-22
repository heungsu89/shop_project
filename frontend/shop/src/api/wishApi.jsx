import axios from "axios";
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/wish`;

/** 관심 상품 추가&삭제 */
export const wishAdd = async (id,itemId)=>{
    const data = {
        memberId:id,
        itemId:itemId
    };
    try {
      const res = await axios.post(`${host}/add`, data, {
        headers: {'Content-Type': 'application/json'}
      });
      console.log('관심 등록 성공:', res.data);
      return res.data;
    } catch (error) {
      console.error('관심 등록 실패:', error.response?.data || error.message);
      throw error;
    }
}
export const wishList = async (id) => {
    try {
        const res = await axios.get(`${host}/page/${id}`);
        return res.data;
    } catch (error) {
        console.error('관심 상품 조회 실패:', error.response?.data || error.message);
        throw error;
    }
}