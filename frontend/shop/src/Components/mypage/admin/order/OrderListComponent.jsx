import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { getFormattedPrice, addComma } from "../../../../util/priecUtil";
import { getOrderStatusText } from "../../../../util/orderStatus"
import { formatDateToDot } from "../../../../util/dateUtil";
import { getOrderList, orderDelete, editStatus} from "../../../../api/orderApi";
import Pagination from "../../../Pagination";
import defaultImg from "../../../../static/images/default.png";


const OrderListComponent =()=>{
    const [orderData, setData] = useState({})
    const [keyword, setKeyword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || 0;
    const size = parseInt(searchParams.get("size")) || 10;

    useEffect(() => {
        fetchList();
    }, [page, size, searchParams]);

    const fetchList = () =>{
        getOrderList(page,size).then(setData)
    }

    const handleKeywordSearch = () => {
        setSearchParams({ page: 0, size, keyword });
    };


    const handleOderDelete = ( oderId ) =>{
        const i = confirm("정말로 삭제 하시겠습니까?");
        if(i){
            orderDelete(oderId);
        }
    }

    const handleOderStatePAID = ( oderId ) =>{
        const i = confirm("입금을 확인하셨나요?");
        if(i){
            editStatus(oderId);
        }
    }


console.log(orderData)

    return(
        <>
        <h2 className="pageTitle">주문</h2>
        <div className="pageContainer">
            <div className="borderSection filter">
                <strong>주문 : {orderData?.totalElements || 0}개</strong>
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
                <div className="btnsWrap">
                    <div>
                        <button className="btn line" type="button">높은판매순</button>
                        <button className="btn line" type="button">낮은판매순</button>
                    </div>

                    {/* <div>
                        <button className="btn line" type="button">높은별점순</button>
                        <button className="btn line" type="button">낮은별점순</button>
                    </div>

                    <div>
                        <button className="btn line" type="button">높은가격순</button>
                        <button className="btn line" type="button">낮은가격순</button>
                    </div>

                    <div>
                        <button className="btn line" type="button">삭제상품</button>
                        <button className="btn line" type="button">정상상품</button>
                    </div> */}
                </div>
            </div>
            <div className="tablePage">
                <div className="itemSubMenu">
                    <Pagination pageInfo={orderData}/>
                </div>
                <div className="itemTableWrap">
                    <table className="itemTable">
                        <thead className="itemThead">
                            <tr className="itemTr">
                                <th className="itemDate">주문일</th>
                                <th className="itemID">주문번호</th>
                                <th className="itemInfo">상품정보</th>
                                <th className="itemPriceInfo">적립포인트</th>
                                <th className="itemPriceInfo">주문금액</th>
                                <th className="itemState">주문상태</th>
                                <th className="itemUtil">주문관리</th>
                            </tr>
                        </thead>
                        <tbody className="itemTbody">
                        {orderData?.content?.length > 0 ? (
                            orderData.content.map((item, index) => {
                                const displayIndex = orderData.totalElements - (page * size + index);
                                return (
                                <tr className="itemTr" key={item.id}>
                                    <td className="itemDate">{displayIndex}</td>
                                    <td className="itemID">{item.id}</td>
                                    <td className="itemInfo">
                                        <div className="itemImg">
                                            <img
                                            src={
                                                item.orderItemList[0].imageName ?
                                                `http://localhost:8081/upload/${item.orderItemList[0].imageName}`
                                                : defaultImg
                                            }
                                            alt={item.name}
                                            />
                                        </div>
                                        <div className="itemDetailInfo">
                                            <p>주문 회원 : {item.memberEmail}</p>
                                            <p>{item.orderItemList[0].itemName} {item.orderItemList?.length > 1 && (` / 외 (${item.orderItemList?.length})`)}</p>
                                            <NavLink to={`detail/${item.id}`}>주문상세보기</NavLink>
                                        </div>
                                    </td>
                                    <td className="itemPriceInfo">{addComma(item.addMileageAmount)}P</td>
                                    <td className="itemPriceInfo">{addComma(item.totalAmount)}원</td>
                                    <td className="itemState">{getOrderStatusText(item.orderStatus)}</td>
                                    <td className="itemUtil">
                                        <button type="button" className="btn black">상풍준비</button>
                                        <button type="button" className="btn line">결제취소</button>
                                        <button type="button" className="btn gray" onClick={()=>handleOderDelete(item.id)}>주문삭제</button>
                                    </td>
                                </tr>
                                );
                            })
                            ) : (
                                <tr>
                                    <td colSpan={9} className="noDataView">주문이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="itemSubMenu">
                    <Pagination pageInfo={orderData}/>
                </div>
            </div>
        </div>
        </>
    )
}
export default OrderListComponent;