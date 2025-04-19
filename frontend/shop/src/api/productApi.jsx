import axios from 'axios';
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/items/listPage`;

/** 상품 불러오기 */
export const productList = async(page,size)=>{
    const p = page ? page : 0;
    const s = size ? size : 5;
    try{
        const res = await axios.get(`${host}?page=${p}&size=${s}`);
        return res.data;
    }catch(error){
        throw error;
    }
};