import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { getFormattedPrice } from "../../../../util/priecUtil";
import { formatDateToDot } from "../../../../util/dateUtil";
import { reviewListAll } from "../../../../api/reviewApi";
import Pagination from "../../../Pagination";
import defaultImg from "../../../../static/images/default.png";

const ReviewListComponent = () => {
  const [reviewList, setRevieList] = useState({});
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page"));
  const size = parseInt(searchParams.get("size"));

  useEffect(() => {
    fetchList();
  }, [page, size, searchParams]);


  const fetchList = () =>{
    reviewListAll(page,size).then(setRevieList)
  }

  const handleKeywordSearch = () => {
      setSearchParams({ page: 0, size, keyword });
  };

  return(
    <>
    <h2 className="pageTitle">리뷰</h2>
    <div className="pageContainer">
        <div className="borderSection filter">
            <strong>등록된 리뷰 : {reviewList?.totalElements || 0}개</strong>
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
            {/* <div className="btnsWrap">
                <div>
                    <button className="btn line" type="button">전체</button>
                    <button className="btn line" type="button">미답변</button>
                    <button className="btn line" type="button">답변완료</button>
                </div>
            </div> */}
        </div>
        <div className="tablePage">
            <div className="itemSubMenu">
                <Pagination pageInfo={reviewList}/>
            </div>
            <div className="itemTableWrap">
                <table className="itemTable">
                    <thead className="itemThead">
                        <tr className="itemTr">
                            <th className="itemNumber">번호</th>
                            <th className="itemInfo">상품</th>
                            <th className="itemWriter">작성자</th>
                            <th className="itemTotalScore">별점</th>
                            <th className="itemDate">등록일</th>
                            <th className="itemDelFlag">상태</th>
                        </tr>
                    </thead>
                    <tbody className="itemTbody">
                    {reviewList?.content?.length > 0 ? (
                        reviewList.content.map((item, index) => {
                            const displayIndex = reviewList.totalElements - (page * size + index);
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
                                            <p>{item.title}</p>
                                            <p>{item.content}</p>
                                            <NavLink to={`/product/detail/${item.itemId}`}>상품상세 보기</NavLink>
                                        </div>
                                    </td>
                                    <td className="itemWriter">{item.writer}</td>
                                    <td className="itemTotalScore">{item.score}</td>
                                    <td className="itemDate">{formatDateToDot(item.date)}</td>
                                    <td className={`itemDelFlag ${item.delFlag ? "deleted" : "active"}`}>
                                        {item.delFlag ? "미게시" : "게시중"}
                                    </td>
                                </tr>
                            )
                        })
                    ):(
                        <tr>
                            <td colSpan={6} className="noDataView">등록된 리뷰 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="itemSubMenu">
                <Pagination pageInfo={reviewList}/>
            </div>
        </div>
    </div>
    </>
)
}

export default ReviewListComponent;