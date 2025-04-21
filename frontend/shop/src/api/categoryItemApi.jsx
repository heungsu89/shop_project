import axios from 'axios';
// import jwtAxios from "../util/jwtUtil"; 
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/category/`; 

export const fetchItems = async (id,page,size) => {
    const p = page ? page : 0;
    const s = size ? size : 9;
    try{
      const res =  await axios.get(`${host}categoryItemPage/${id}?page=${page}&size=${size}`)
      console.log(res.data)
      return res.data;
    }catch(error){
      throw error;
    }
};