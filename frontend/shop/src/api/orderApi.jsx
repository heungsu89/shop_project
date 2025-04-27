import axios from "axios";

const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/order`;

/** 주문 완료 */
export const orderAdd = async ( data ) =>{
    console.log(`${host}/add`)
    try{
        const res = await axios.post(`${host}/add`,data)
        console.log(res.data)
        return res.data;
    }catch(error){
        throw error;
    }
}

/** 회원 아이디로 주문 내역 리스트 */
export const getIdOrderList = async (id,page,size)=>{
    try{
        const res = await axios.get(`${host}/getOrderWithMemberIdPage/${id}`, {
            params: {
              page: 0,
              size: 10
            }
          });
        console.log(res.data)
        return res.data;
    }catch(error){
        throw error;
    }
}

/** 회원 아이디로 주문조회*/
export const getOneOrder = async (id)=>{
    try{
        const res = await axios.get(`${host}/getOrderById/${id}`);
        console.log(res.data)
        return res.data;
    }catch(error){
        throw error;
    }
}