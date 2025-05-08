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
export const getOneOrder = async (id) =>{
    try{
        const res = await axios.get(`${host}/getOrderById/${id}`);
        console.log(res.data)
        return res.data;
    }catch(error){
        throw error;
    }
}

/** 모든 주문 조회 */
export const getOrderList = async (page,size) =>{
    try{
        const res = await axios.get(`${host}/getOrderList?page=${page}&size=${size}`);
        return res.data;
    }catch(error){
        throw error;
    }
}

/** 주문삭제 */
export const orderDelete =  async (oderId) => {
    try{
        const res = await axios.delete(`${host}/delete/${oderId}`);
        return res.data;
    }catch(error){
        throw error;
    }
}

/** 주문삭제 */
export const editStatus = async (oderId,deliveryStatus) => {
    try{
        const res = await axios.put(`${host}/editStatus}`,{
            id : oderId,
            deliveryStatus
        });
        return res.data;
    }catch(error){
        throw error;
    }
}