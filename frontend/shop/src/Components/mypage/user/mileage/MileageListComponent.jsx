import { useState, useEffect } from 'react';
import { getwishList } from "../../../../api/wishApi";
import { useParams } from 'react-router-dom';
import Pagination from "../../../Pagination";
import defaultImg from "../../../../static/images/default.png";
import { useSearchParams } from 'react-router-dom';

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
  
  return(
    <>
    <h2 className="pageTitle">마일리지</h2>
    <div className="pageContainer">
        <div>

        </div>
        <div className="borderSection filter">
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
            <div className="itemTableWrap">
                <table className="itemTable">
                    <thead className="itemThead">
                        <tr className="itemTr">
                            <th className="itemDate">일자</th>
                            <th className="itemInfo">주문</th>
                            <th className="itemMileage">적립&사용</th>
                            <th className="itemMileage">마일리지</th>
                        </tr>
                    </thead>
                    <tbody className="itemTbody">
                    {wishData?.content?.length > 0 ? (
                        wishData.content.map((item, index) => {
                            return (
                                <tr className="itemTr" key={item.id}>
                                  <td className="itemDate">일자</td>
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
                                        <p >{item.itemId}</p>
                                        <p className="itemName">{item.itemName}</p>
                                        <p className="itemPrice">{item.itemPrice}</p>
                                    </div>
                                  </td>
                                  <td className="itemMileage">적립&사용</td>
                                  <td className="itemMileage">마일리지</td>
                                </tr>
                            );
                        })
                        ) : (
                            <tr>
                                <td colSpan={4}>마일리지 적립 및 사용 이력이 없습니다.</td>
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