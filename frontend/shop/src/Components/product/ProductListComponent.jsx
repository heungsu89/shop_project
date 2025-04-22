import React, { useEffect } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { wishAdd } from "../../api/wishApi";
import { getFormattedPrice } from "../../util/priecUtil";
import defaultImg from "../../static/images/default.png"; 

const ProductListComponent = () => {
  const {loginState,items,categoryId} = useOutletContext();
  const isLoggedIn = loginState && loginState.email !== '';

  const handleAddCart = (itemId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoggedIn) {
      console.log("장바구니 추가:", itemId);
      // cartAdd(memberInfo.memberId, itemId); // 예시
    } else {
      alert('로그인을 하셔야 사용이 가능합니다.');
    }
  };

  const handleAddWishlist = async (itemId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      alert("로그인을 하셔야 사용이 가능합니다.");
      return;
    }
    wishAdd(loginState.memberId, itemId).then((res) => {
      if(res === "삭제됨"){
        alert("위시리스트에서 삭제되었습니다.");
      }else{
        alert("위시리스트에 추가되었습니다.");
      }
    })
  };

  return (
    <div className="itemListSection">
      {items?.content?.length > 0 ? (
        <ul>
          {items.content.map((item) => {
            const priceInfo = getFormattedPrice(item.price, item.discountRate);
            return (
              <li className="itemCard" key={item.itemId}>
                <NavLink to={`/product/detail/${item.itemId}`}>
                  <div className="itemImageWrapper">
                    <img
                      src={item.uploadFileNames !== "default.png"
                        ? `http://localhost:8081/upload/${item.uploadFileNames}`
                        : defaultImg}
                      alt={item.itemName}
                    />
                    <div className="itemButtonGroup">
                      <button onClick={(e) => handleAddWishlist(item.itemId, e)}>WISH</button>
                      <button onClick={(e) => handleAddCart(item.itemId, e)}>CART</button>
                    </div>
                  </div>
                  <div className="itemInfo">
                    <div className="itemName">{item.itemName}</div>
                    <div className="space">
                      <span className="itemSalePrice">{priceInfo.discounted}KRE</span>
                      <span className="itemOriginalPrice">{priceInfo.original}</span>
                      <span className="itemDiscount">{priceInfo.discountRate}</span>
                    </div>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='innerWrap'>등록된 상품이 없습니다.</div>
      )}
    </div>
  );
};

export default ProductListComponent;
