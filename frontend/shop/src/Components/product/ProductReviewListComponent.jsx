import React, { useState, useEffect } from "react";
import { formatDateToDot } from "../../util/dateUtil"
import { purchaseCheck, getProductReviewList, getOneReview} from "../../api/reviewApi";
import defaultImg from "../../static/images/default.png";
import Pagination from "../Pagination";

const ProductReviewList = ( {memberId, productId} ) =>{
    const [revieList,setReviewList] = useState({}) || null;
    const [pCheck, setPCheck] =  useState() || false;

    useEffect(()=>{
        purchaseCheck(memberId,productId).then(setPCheck);
    },[memberId,productId])

    useEffect(()=>{
        getProductReviewList(productId).then(setReviewList);
        getOneReview(memberId).then()
    },[productId])
    console.log(revieList);


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
                    {revieList?.content?.length > 0 ? (
                        revieList.content.map((item, index) => {
                            return (
                                <tr className="itemTr" key={item.id}>
                                  <td className="itemInfo">
                                    <div className="itemImg">
                                        <img
                                        src={
                                            item.itemImage?.length > 0
                                            ? `http://localhost:8081/upload/${item.itemImage}`
                                            : defaultImg
                                        }
                                        alt={item.name}
                                        />
                                    </div>
                                    <div className="itemDetailInfo">
                                        <p>{item.title}</p>
                                    </div>
                                  </td>
                                  <td className="itemWriter">{item.writer}</td>
                                  <td className="itemDate">{formatDateToDot(item.date)}</td>
                                  <td className='itemTotalScore'><div className="rating" data-rating={Math.ceil(item.score)}></div></td>
                                </tr>
                            );
                        })
                        ) : (
                            <tr>
                                <td colSpan={5} className="noDataView">등록된 리뷰가 없습니다.</td>
                            </tr>
                        )}
                </tbody>
                </table>

            </div>
            <div className="itemSubMenu">
                <Pagination
                    pageInfo={revieList}
                />
                {pCheck && <button type="button" className="btn black">리뷰등록</button>}
            </div>
            
        </div>
    )
}
export default ProductReviewList;