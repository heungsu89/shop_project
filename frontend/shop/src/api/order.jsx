import axios from "axios";

const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/order`;

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