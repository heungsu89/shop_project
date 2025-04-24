import React, { useState, useEffect } from "react";
import { formatDateToDot } from "../../util/dateUtil"
import { qnaList } from "../../api/qnaApi";
import defaultImg from "../../static/images/default.png";
import Pagination from "../Pagination";

const ProductReviewList = ( {memberId, productId} ) =>{
    // const [qnaList,setQnaList] = useState({}) || null;

    // useEffect(()=>{
    //     qnaList(productId).then(setQnaList);
    // },[productId])

    // console.log(qnaList);


    return(
        <div className="tablePage product">
            <div className="itemTableWrap">
                <table className="itemTable">
                    {/* <thead className="itemThead">
                        <tr className="itemTr">
                            <th className="itemNumber">번호</th>
                            <th className="itemInfo">상품</th>
                            <th className="itemDiscountRate">할인율</th>
                            <th className="itemPriceInfo">가격</th>
                            <th className="itemTotalScore">평점</th>
                            <th className="itemDate">등록일</th>
                            <th className='itemWish'>관심</th>
                        </tr>
                    </thead> */}
                    <tbody className="itemTbody">
                    {/* {qnaList?.content?.length > 0 ? (
                        qnaList.content.map((item, index) => {
                            return (
                                <tr className="itemTr" key={item.id}>
                                  <td className="itemWriter">{item.writer}</td>
                                  <td className="itemDate">{formatDateToDot(item.date)}</td>
                                  <td className='itemTotalScore'><div className="rating" data-rating={Math.ceil(item.score)}></div></td>
                                </tr>
                            );
                        })
                        ) : ( */}
                            <tr>
                                <td colSpan={5} className="noDataView">등록된 QnA가 없습니다.</td>
                            </tr>
                        {/* )} */}
                </tbody>
                </table>

            </div>
            {/* <div className="itemSubMenu">
                <Pagination
                    pageInfo={qnaList}
                />
                {pCheck && <button type="button" className="btn black">리뷰등록</button>}
            </div> */}
            
        </div>
    )
}
export default ProductReviewList;