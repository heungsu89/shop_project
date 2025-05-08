import { useState, useEffect } from 'react';
import { getwishList } from "../../../../api/wishApi";
import { useParams } from 'react-router-dom';
import Pagination from "../../../Pagination";
import defaultImg from "../../../../static/images/default.png";
import { useSearchParams } from 'react-router-dom';
import { getFormattedPrice } from "../../../../util/priecUtil";
import { formatDateToDot } from "../../../../util/dateUtil";

const MileageComponent = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"));
  const size = parseInt(searchParams.get("size"));
  const [wishData, setData] = useState({});

  useEffect(() => {
    fetchList();
    console.log("마일리지 데이터", wishData);
  }, [page, size, id]);

  const fetchList = () => {
    getwishList(id,page,size).then(setData);
  }
  
const handleChange = (id) => {
    
}

  
  return(
    <>
    <h2 className="pageTitle">관심상품</h2>
    <div className="pageContainer">
        <div className="tablePage">
            <div className="itemTableWrap">
                <table className="itemTable">
                    <thead className="itemThead">
                        <tr className="itemTr">
                            <th className="itemNumber">번호</th>
                            <th className="itemInfo">상품</th>
                            <th className="itemDiscountRate">할인율</th>
                            <th className="itemPriceInfo">가격</th>
                            <th className="itemTotalScore">평점</th>
                            <th className="itemDate">등록일</th>
                            <th className='itemWish'>관심</th>
                        </tr>
                    </thead>
                    <tbody className="itemTbody">
                    {wishData?.content?.length > 0 ? (
                        wishData.content.map((item, index) => {
                            const displayIndex = wishData.totalElements - (page * size + index);
                            return (
                                <tr className="itemTr" key={item.id}>
                                  <td className="itemNumber">{displayIndex}</td>
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
                                        <p>상품 아이디 : {item.itemId}</p>
                                        <p className="itemName">{item.itemName}</p>
                                    </div>
                                  </td>
                                  <td className="itemDiscountRate">{item.itemDiscountRate}%</td>
                                  <td className="itemPriceInfo">{item.discountRate > 0 ? (
                                        <>
                                        <span className="itemOriginalPrice">
                                            {getFormattedPrice(item.itemPrice, 0).original}원
                                        </span>
                                        <span className="itemPrice">
                                            {getFormattedPrice(item.itemPrice, item.itemDiscountRate).discounted}원
                                        </span>
                                        </>
                                    ) : (
                                        <span className="itemPrice">
                                        {getFormattedPrice(item.itemPrice, 0).original}원
                                        </span>
                                    )}</td>
                                  <td className="itemTotalScore">{item.itemScore}</td>
                                  <td className="itemDate">{formatDateToDot(item.dueDate)}</td>
                                  <td className='itemWish'>
                                    <button type="button" className='btn' onClick={handleChange(item.wishListId)}>관심해제</button>
                                  </td>
                                </tr>
                            );
                        })
                        ) : (
                            <tr>
                                <td colSpan={7}>관심으로 등록한 상품이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="itemSubMenu">
                <Pagination pageInfo={wishData}/>
            </div>
        </div>
    </div>
    </>
  )
}

export default MileageComponent;