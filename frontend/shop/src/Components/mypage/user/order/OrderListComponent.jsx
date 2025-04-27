import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { getIdOrderList } from "../../../../api/orderApi";
import { formatDateToDot } from "../../../../util/dateUtil";
import { addComma, getFormattedPrice } from "../../../../util/priecUtil";
import { getOrderStatusText } from "../../../../util/orderStatus"
import Pagination from "../../../Pagination";

const OrderComponent = () => {
  const navigate = useNavigate();
  const loginState = useSelector(state => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [ oderList, setList ] = useState([]);
  const page = parseInt(searchParams.get("page"));
  const size = parseInt(searchParams.get("size"));
 
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }


    getIdOrderList(loginState.memberId,page,size).then(setList)

  }, [isLoggedIn, navigate,page, size, searchParams]);


  const handleKeywordSearch = () => {
    setSearchParams({ page: 0, size, keyword });
};

  return(
    <>
    <h2 className="pageTitle">주문</h2>
    <div className="pageContainer">
      <div className="borderSection filter">
            <strong>누적 주문 : {oderList?.totalElements || 0}개</strong>
            <div className='inputWrap'>
                <div className="inputBox">
                    <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색어를 입력해주세요."
                    type="text"
                    />
                    <button className="btn black" type="button" onClick={handleKeywordSearch}>검색</button>
                </div>
            </div>
            <div className='inputWrap'>
                <div className="inputBox">
                    <input name=""
                    // value={form.categoryName}
                    // onChange={handleChange}
                    placeholder="시작일"
                    type="text"
                    />
                    ~
                    <input name=""
                    // value={form.categoryName}
                    // onChange={handleChange}
                    placeholder="종료일"
                    type="text"
                    />
                    <button className="btn black" type="button">검색</button>
                </div>
            </div>
        </div>
        <div className="tablePage">
          <div className="itemSubMenu">
              <Pagination pageInfo={oderList}/>
          </div>
          <div className="itemTableWrap">
              <table className="itemTable">
                  <thead className="itemThead">
                      <tr className="itemTr">
                        <th className="itemDate">주문일</th>
                        <th className="itemID">주문번호</th>
                        <th className="itemInfo">주문정보</th>
                        <th className="itemPriceInfo">마일리지</th>
                        <th className="itemPriceInfo">결제제금액</th>
                        <th className="itemStatus">주문상태</th>
                      </tr>
                  </thead>
                  <tbody className="itemTbody">
                  {oderList?.content?.length > 0 ? (
                      oderList.content.map((item, index) => {
                          const displayIndex = oderList.totalElements - (page * size + index);
                            return (
                            <tr className="itemTr" key={item.id}>
                              <td className="itemDate">{formatDateToDot(item.orderDate)}</td>
                              <td className="itemID">{item.id}</td>
                              <td className="itemInfo">
                                <div className="itemImg">
                                  <img
                                  src={
                                      item.orderItemList[0]?.imageName?.length > 0
                                      ? `http://localhost:8081/upload/${item.orderItemList[0]?.imageName}`
                                      : defaultImg
                                  }
                                  alt={item.orderItemList[0].itemName}
                                  />
                                </div>
                                <div className="itemDetailInfo">
                                  <NavLink to={`detail/${item.id}`}>주문상세보기</NavLink>
                                  <p>{item.orderItemList[0].itemName}  
                                    {item.orderItemList?.length > 0 && `외 (${item.orderItemList?.length})`}
                                  </p>
                                </div>
                              </td>
                              <td className="itemPriceInfo">{item.addMileageAmount}P</td>
                              <td className="itemPriceInfo">{addComma(item.totalAmount)}</td>
                              <td className="itemStatus">{getOrderStatusText(item.deliveryStatus)}</td>
                            </tr>
                            );
                          })
                      ) : (
                          <tr>
                              <td colSpan={6} className="noDataView">주문 내역이 없습니다.</td>
                          </tr>
                    )}
                  </tbody>
              </table>
          </div>
          <div className="itemSubMenu">
              <Pagination pageInfo={oderList}/>
          </div>
      </div>
    </div>
    </>
  )
}

export default OrderComponent;