import React, { useState, useEffect } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCategories } from "../../api/categoryApi";
import { useParams } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";
import { fetchItems } from "../../api/categoryItemApi";
import "../../static/css/shop.scss";
import "../../static/css/siderbar.scss";
import defaultImg from "../../static/images/default.png";
import Pagination from "../../Components/Pagination";
import { getFormattedPrice } from "../../util/priecUtil";
import { getCookie, removeCookie } from "../../util/cookieUtil";
import { wishAdd } from "../../api/wishApi";

const ItemListPage = () => {
  const loginState = useSelector(state => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';
  const [memberInfo, setInfo] = useState(null);
  const { categoryId } = useParams();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [childCategorys, setChildCategorys] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "9", 10);

  useEffect(() => {



    const fetchCategory = async () => {
      const currentCategory = await getCategories(categoryId);
      setCurrentCategory(currentCategory);
  
      if (currentCategory?.parentId) {
        // 자식이면, 부모를 다시 조회해서 형제들(child)을 얻어옴
        const parentCategory = await getCategories(currentCategory.parentId);
        setChildCategorys(parentCategory.child);
      } else {
        // 부모일 경우, 그대로 사용
        setChildCategorys(currentCategory.child);
      }
    };
  
    fetchCategory();













    fetchItems(categoryId, page, size).then(data => {
      setItems(data);
    });
    if (isLoggedIn) {
      const info = getCookie("member");
      setInfo(info);
    } else {
      setInfo(null);
    }
  }, [categoryId, page, size,isLoggedIn ]);

  
  const handleAddCart = (itemId,e) => {
    e.stopPropagation();
    e.preventDefault(); 

    if(isLoggedIn){
      console.log(memberInfo?.memberId)
      // wishAdd(memberInfo?.memberId,itemId)
      console.log("장바구니 추가:");
    }else{
      alert('로그인을 하셔야 사용이 가능합니다.');
    }
  };

  const handleAddWishlist = async (itemId, e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!isLoggedIn) {
      alert("로그인을 하셔야 사용이 가능합니다.");
      return;
    }
  
    try {
      const res = await wishAdd(memberInfo?.memberId, itemId);
      if (res === "삭제됨") {
        console.log("위시리스트에서 삭제됨");
        // UI에서도 위시 제거 처리 가능
      } else {
        console.log("위시리스트에 추가됨");
      }
    } catch (err) {
      console.error("처리 중 오류", err);
    }
  };

  return (
    <BasicLayout>
      <div className="itemListContainer">
        <div className="itemListSection">
        {items?.content?.length > 0 ? (
          items?.content?.map((item,idx) =>{
            const priceInfo = getFormattedPrice( item.price,item.discountRate);
            return(
              <NavLink to={`/item/${item.itemId}`}
                key={item.itemId}
                className="itemCard"
              >
                <div className="itemImageWrapper">
                  <img
                    src={
                        item.uploadFileNames !== "default.png"?
                        `http://localhost:8081/upload/${item.uploadFileNames}`
                        : defaultImg
                    }
                    alt={item.itemName}
                    />
                  <div className="itemButtonGroup">
                    <button onClick={(e) => handleAddWishlist(item.itemId,e)}>WISH</button>
                    <button onClick={(e) => handleAddCart(item.itemId,e)}>CART</button>
                  </div>
                </div>
                <div className="itemInfo">
                  <div className="itemName">{item.itemName}</div>
                  <div className="space">
                    <span className="itemSalePrice">
                      {priceInfo.discounted}KRE
                    </span>
                    <span className="itemOriginalPrice">{priceInfo.original}</span>
                    <span className="itemDiscount">{priceInfo.discountRate}</span>
                  </div>
                </div>
              </NavLink>
          )})
        ) : (
          <div>등록된 상품이 없습니다.</div>
        )}
        </div>

        <aside className="itemSidebar">
          <div className="innerSiedbarWrap">
            <h2 className="categoryTitle">SHOP</h2>

            <div className="searchBox">
              <input type="text" placeholder="SEARCH TEXT" />
              <button type="button" className="btn black">SEARCH</button>
            </div>

            <nav>
              <ul className="categoryList">
                {childCategorys?.map((category) => (
                  <li key={category.categoryId}>
                    <NavLink 
                    to={`/shop/category/${category.categoryId}?page=${page}&size=${size}`}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      {category.categoryName}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>


            <div className="paginationSection">
              <div className="totalCount">TOTAL : {items.totalElements}</div>
              <div className="sortButtons">
                <button type="button" className="btn line">NEWEST</button>
                <button type="button" className="btn line">PRICE HIGH</button>
                <button type="button" className="btn line">PRICE LOW</button>
              </div>
              <Pagination pageInfo={items}/>
            </div>

          </div>
        </aside>
      </div>
    </BasicLayout>
  );
};

export default ItemListPage;