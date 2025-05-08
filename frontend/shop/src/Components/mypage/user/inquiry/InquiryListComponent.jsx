import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { getFormattedPrice } from "../../../../util/priecUtil";
import { formatDateToDot } from "../../../../util/dateUtil";
import { qnaListAll } from "../../../../api/qnaApi";
import Pagination from "../../../Pagination";

const InquiryComponent = () => {
  const [qnaList, setQnaList] = useState({});
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page"));
  const size = parseInt(searchParams.get("size"));

  useEffect(() => {
    fetchList();
  }, [page, size, searchParams]);


  const fetchList = () =>{
    qnaListAll(page,size).then(setQnaList)
  }

  const handleKeywordSearch = () => {
      setSearchParams({ page: 0, size, keyword });
  };

  return(
    <>
    <h2 className="pageTitle">문의</h2>
    <div className="pageContainer">
        <div className="borderSection filter">
            <strong>등록된 상품 갯수 : {qnaList?.totalElements || 0}개</strong>
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
                    <button className="btn line" type="button">전체</button>
                    <button className="btn line" type="button">미답변</button>
                    <button className="btn line" type="button">답변완료</button>
                </div>
            </div>
        </div>
        <div className="tablePage">
            <div className="itemSubMenu">
                <Pagination pageInfo={qnaList}/>
            </div>
            <div className="itemTableWrap">
                <table className="itemTable">
                    <thead className="itemThead">
                        <tr className="itemTr">
                            <th className="itemNumber">번호</th>
                            <th className="itemInfo">상품 문의</th>
                            <th className="itemDate">등록일</th>
                            <th className="itemState">답변상태</th>
                            <th className="itemState">답변</th>
                        </tr>
                    </thead>
                    <tbody className="itemTbody">
                    {qnaList?.content?.length > 0 ? (
                        qnaList.content.map((item, index) => {
                            const displayIndex = qnaList.totalElements - (page * size + index);
                            return (
                            <tr className="itemTr" key={item.id}>
                                <td className="itemNumber">{displayIndex}</td>
                                <td className="itemInfo">
                                <div className="itemImg">
                                    <img
                                    src={
                                        item.uploadFileNames?.length > 0
                                        ? `http://localhost:8081/upload/${item.uploadFileNames[0]}`
                                        : defaultImg
                                    }
                                    alt={item.name}
                                    />
                                </div>
                                <div className="itemDetailInfo">
                                    <p>{item.name}</p>
                                    {item.options?.length > 0 && (
                                    <p className="itemOption">
                                        {item.options[0].optionName} :{" "}
                                        {item.options
                                        .map((op) => `${op.optionValue} (수량 : ${op.stockQty}개)`)
                                        .join(", ")}
                                    </p>
                                    )}
                                    <NavLink to={`/admin/mypage/product/modify/${item.id}`}>
                                    상품상세 보기
                                    </NavLink>
                                </div>
                                </td>
                                <td className="itemDiscountRate">{item.discountRate}%</td>
                                <td className="itemPriceInfo">
                                {item.discountRate > 0 ? (
                                    <>
                                    <span className="itemOriginalPrice">
                                        {getFormattedPrice(item.price, 0).original}원
                                    </span>
                                    <span className="itemPrice">
                                        {getFormattedPrice(item.price, item.discountRate).discounted}원
                                    </span>
                                    </>
                                ) : (
                                    <span className="itemPrice">
                                    {getFormattedPrice(item.price, 0).original}원
                                    </span>
                                )}
                                </td>
                                <td className="itemTotalScore">{item.totalScore}</td>
                                <td className="itemDate">{formatDateToDot(item.dueDate)}</td>
                                <td className="itemSalesVolume">{item.salesVolume}</td>
                                <td className={`itemDelFlag ${item.delFlag ? "deleted" : "active"}`}>
                                {item.delFlag ? "판매중지" : "판매중"}
                                </td>
                            </tr>
                            );
                        })
                        ) : (
                            <tr>
                                <td colSpan={9}>등록된 상품이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="itemSubMenu">
                <Pagination pageInfo={productData}/>
            </div>
        </div>
    </div>
    </>
)
}

export default InquiryComponent;