import axios from 'axios';
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST;
const host = `${API_SERVER_HOST}/api/qnaList`;

/** QnA 등록 
{
    "title" : "답변입니다.",
    "writer" : "작성자입니다.",
    "content" : "답변내용입니다.",
    "parentId" : 1,
    "memberId" : 1,
    "itemId" : 1
}
 */
export const addQna = async (form) =>{
    try{
        const res = await axios.post(`${host}/add/${id}`,form);
    }catch(erorr){
        throw erorr;
    }
}

/** 리뷰 수정
 {
    "qnaListId" : 2,
    "memberId" : 1,
    "title" : "수정된 제목입니다.",
    "writer" : "수정된 작성자입니다.",
    "content" : "수정된 내용입니다.",
    "delFlag" : true,
    // 이하부터는 변경사항이 있다면 값을 보내고 없다면 값을 보내지 않거나(null값을 보내면 안됨), 원래 값을 보내기
    // 답변: ANSWER, 답변완료: ANSWER_COMPLETED, 답변대기: WAITING_ANSWER
    "qnAListStatus" : "ANSWER",
    "parentId" : 1
}
*/
export const modifyQna = async (form) =>{
    try{
        const res = await axios.put(`${host}/edit/`,form);
    }catch(erorr){
        throw erorr;
    }
}

/** 리뷰 삭제 
{
    "qnaListId" : 1,
    "memberId" : 1
}
*/
export const deleteReview = async (data) =>{
    try{
        const res = await axios.delete(`${host}/delete/`,data);
        return res.data;
    }catch(erorr){
        throw erorr;
    }
}


/** 질의응답 조회 */
export const getOneReview = async (id) =>{
    try{
        const res = await axios.get(`${host}/list/${id}`);
        return res.data;
    }catch(erorr){
        throw erorr;
    }
}


/** 모든 질의응답 조회*/
export const qnaList = async (id) =>{
    try{
        const res = await axios.get(`${host}/listPageWithDelFlag?page=0&size=10`);
        return res.data;
    }catch(erorr){
        throw erorr;
    }
}


/** (관리자용)모든 질의응답 조회*/
export const qnaListAll = async (id) =>{
    try{
        const res = await axios.get(`${host}/listPage?page=0&size=10`);
        return res.data;
    }catch(erorr){
        throw erorr;
    }
}

