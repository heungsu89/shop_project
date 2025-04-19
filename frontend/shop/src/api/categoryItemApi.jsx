import axios from 'axios';
// import jwtAxios from "../util/jwtUtil"; 
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const itemHost = `${API_SERVER_HOST}/api/category/page`; 

export const fetchItems = async (category) =>{

    try {
      const res = await axios.get(`${itemHost}/${category}?page=0&size=10`, {
        params: {
          id: category
        },
      });
      console.log('상품 목록 조회 성공:', res.data);
      return res.data;
    } catch (error) {
      console.error('상품 목록 조회 실패:', error.response?.data || error.message);
      throw error; 
    }
}