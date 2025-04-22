import axios from "axios";
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/wish`;

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