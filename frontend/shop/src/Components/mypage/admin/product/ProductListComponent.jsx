

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { getFormattedPrice } from "../../../../util/priecUtil";
import { formatDateToDot } from "../../../../util/dateUtil";
import { productList } from "../../../../api/productApi";

const ProductListComponent = () =>{
    const [productData, setData] = useState({});
    const [keyword, setKeyword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page"));
    const size = parseInt(searchParams.get("size"));

    useEffect(() => {
        fetchList();
    }, [page, size, searchParams]);


    const fetchList = () =>{
        productList(page,size).then(setData)
    }

    const handleKeywordSearch = () => {
        setSearchParams({ page: 0, size, keyword });
    };

    return(
        <>
        <h2 className="papgeTitle">상품</h2>
        <div className="pageContainer">
            <div className="borderSection filter">
                <strong>등록된 상품 갯수 : {productData?.totalElements || 0}개</strong>
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

                    <div>
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
                    </div>
                </div>
            </div>
            <div className="tablePage">
                <div className="itemSubMenu">
                    <Pagination pageInfo={productData}/>
                    <Link className="btn black" to={'add'}>상품등록</Link>
                </div>
                <table className="itemTable">
                    <thead className="itemThead">
                        <tr className="itemTr">
                            <th className="itemNumber">번호</th>
                            <th className="itemID">상품ID</th>
                            <th className="itemInfo">상품정보</th>
                            <th className="itemDiscountRate">할인율</th>
                            <th className="itemPriceInfo">가격</th>
                            <th className="itemTotalScore">별점</th>
                            <th className="itemDate">등록일</th>
                            <th className="itemSalesVolume">판매량</th>
                            <th className="itemDelFlag">판매상태</th>
                        </tr>
                    </thead>
                    <tbody className="itemTbody">
                        {
                            productData?.content?.map((item, index) => {
                                const displayIndex = productData.totalElements - (page * size + index);
                                return (
                                    <tr className="itemTr" key={item.id}>
                                        <td className="itemNumber">{displayIndex}</td>
                                        <td className="itemID">{item.id}</td>
                                        <td className="itemInfo">
                                            <div className="itemImg">
                                                <img src={item.uploadFileNames?.[0] || '/default.png'} alt={item.name}/>
                                            </div>
                                            <div className="itemDetailInfo">
                                                <p>{item.name}</p>
                                                {item.options?.length > 0 && (
                                                <p className="itemOption">
                                                    {item.options[0].optionName} : {" "}
                                                    {item.options
                                                        .map(op => `${op.optionValue} (수량 : ${op.stockQty}개)`)
                                                        .join(", ")
                                                    }
                                                </p>
                                                )}
                                                <NavLink to={'#'}>상품상세 보기</NavLink>
                                            </div>
                                        </td>
                                        <td className="itemDiscountRate">
                                            {item.salesVolume}%
                                        </td>
                                        <td className="itemPriceInfo">
                                            {item.salesVolume>0 ? (
                                                <>
                                                <span className="itemOriginalPrice">{getFormattedPrice(item.price,0).original}원</span>
                                                <span className="itemPrice">{getFormattedPrice(item.price,item.discountRate).discounted}원</span>
                                                </>
                                            ):(
                                                <span className="itemPrice">{getFormattedPrice(item.price,0).original}원</span>
                                            )}
                                        </td>
                                        <td className="itemTotalScore">
                                            {item.totalScore}
                                        </td>
                                        <td className="itemDate">{formatDateToDot(item.dueDate)}</td>
                                        <td className="itemSalesVolume">{item.salesVolume}</td>
                                        <td className={`itemDelFlag ${item.delFlag ? 'deleted' : 'active'}`}>{item.delFlag ? "판매중지" : "판매중"}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="itemSubMenu">
                    <Pagination pageInfo={productData}/>
                    <Link className="btn black" to={'add'}>상품등록</Link>
                </div>
            </div>
        </div>
        </>
    )
}
export default ProductListComponent;