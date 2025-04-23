import axios from 'axios';
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/items`;

/** 상품 불러오기 */
export const productList = async(page,size)=>{
    const p = page ? page : 0;
    const s = size ? size : 5;
    try{
        const res = await axios.get(`${host}/listPage?page=${p}&size=${s}`);
        console.log(res.data);
        return res.data;
    }catch(error){
        throw error;
    }
};

/** 특정 상품 조회 */ 
export const getProductById = async (id) => {
    const res = await axios.get(`${host}/${id}`);
    return res.data;
};


/** 상품 등록 요청 */

export const registerProduct = async ({ itemDTO, categoryId, files }) => {
  const formData = new FormData();
  formData.append("itemDTO", JSON.stringify(itemDTO));
  formData.append("categoryId", categoryId);
  files.forEach(file => {
    formData.append("files", file);  // 같은 key로 여러 이미지 파일 추가
  });
  try{
    const res = await axios.post(`${host}/add`, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    alert("상품등록완료")
    return res.data;
  }catch(error){
    console.log(error);
    throw error;
  }
  
};
  
  
/** 상품 수정 */
export const updateProduct = async ({ id, itemDTO, files = [] }) => {
  const formData = new FormData();
  formData.append('itemDTO', new Blob([JSON.stringify(itemDTO)], { type: 'application/json' }));
  files.forEach(file => {
    formData.append('files', file); // ✅ 여러 파일 처리
  });
  for (let pair of formData.entries()) {
    console.log('FormData key:', pair[0], 'value:', pair[1]);
  }
  try{
    const response = await axios.post(`${host}/modify/${id}`, formData);
    return response.data;
  }catch(error){
    console.log(error);
    throw error;
  } 
}

/** 상품삭제 */
export const deleteProduct = async (id) =>{
  console.log(id)
  try{
    const res = await axios.delete(`${host}/${id}`);
    return res.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}
  