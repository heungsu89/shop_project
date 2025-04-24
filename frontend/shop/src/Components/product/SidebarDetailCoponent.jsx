import { NavLink, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getFormattedPrice, addComma } from "../../util/priecUtil";
import { getProductById } from "../../api/productApi";
import { useOutletContext } from 'react-router-dom';

const SidebarDetailComponent = () => {
    const { productId } = useParams();
    const { memberInfo } = useOutletContext() || {};
    const [product, setProduct] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [mileage, setMileage] = useState(0);
  
    useEffect(() => {
      getProductById(productId).then((res) => {
        setProduct(res);
      });
    }, [productId]);
  
    const handleOptionClick = (option) => {
        const exists = selectedOptions.find(o => o.optionId === option.optionId);
        if (exists) {
          // 이미 선택된 옵션이면 제거
          setSelectedOptions(prev =>
            prev.filter(o => o.optionId !== option.optionId)
          );
        } else {
          // 선택되지 않은 옵션이면 추가
          setSelectedOptions([...selectedOptions, { ...option, quantity: 1 }]);
        }
      };
  
    const updateQuantity = (optionId, delta) => {
        setSelectedOptions(prev =>
          prev.map(o => {
            if (o.optionId === optionId) {
              const newQty = o.quantity + delta;
              // 최소 1개, 최대 재고량까지
              const limitedQty = Math.max(1, Math.min(newQty, o.stockQty));
              return { ...o, quantity: limitedQty };
            }
            return o;
          })
        );
      };
  
    const calculateTotal = () => {
      if (!product) return 0;
      return selectedOptions.reduce((sum, option) => {
        return sum + ((product.price + option.optionPrice) * option.quantity);
      }, 0);
    };
  
    // 마일리지 계산은 product와 selectedOptions가 준비된 뒤 실행
    useEffect(() => {
      if (!product || !memberInfo) return;
  

      const discountPrice = Math.floor(product.price * (1 - product.discountRate / 100));
      console.log(discountPrice)
      let rate = 0;
  
      switch (memberInfo.memberShip) {
        case "BRONZE": rate = 0.01; break;
        case "SILVER": rate = 0.02; break;
        case "GOLD": rate = 0.03; break;
        case "PLATINUM": rate = 0.05; break;
        default: rate = 0;
      }
      setMileage(Math.round(discountPrice * rate));
    }, [product, memberInfo]);
  
    if (!product) return <div className="itemSidebar">Loading...</div>;
  
    const formatted = getFormattedPrice(product.price, product.discountRate);
    const uniqueOptionNames = [...new Set(product.options.map(o => o.optionName))];
  

  return (
    <aside className="itemSidebar productDetail">
    <div className="sidebarInnerWrap">
        
        {/* 상품 번호 + 버튼 영역 */}
        <div className="productMeta">
            <span className="productId">NO.{product.id}</span>
            <div className="actionButtons">
                <button type="button" className="btnWish">WISH</button>
                <button type="button" className="btnCart">CART</button>
            </div>
        </div>

        {/* 상품명 */}
        <h2 className="productTitle">{product.name}</h2>

        {/* 가격 정보 */}
        <div className="priceSection">
            {product.discountRate === 0 ? (
                <span className="priceNow">{formatted.discounted} KRE</span>
            ) : (
                <>
                    <span className="priceNow">{formatted.discounted} KRE</span>
                    <span className="priceOriginal">{formatted.original}</span>
                    <span className="priceDiscount">{formatted.discountRate}</span>
                </>
            )}

        </div>

        {memberInfo && <div className="mileage">MILEAGE : {mileage}P ({memberInfo.memberShip})</div>}
        
        {/* 평점 */}
        <div className="rating" data-rating={Math.ceil(product.totalScore)}></div>

        {/* 옵션 선택 영역 */}
        {uniqueOptionNames.map(name => (
        <div key={name} className="optionGroup">
            <div className="optionLabel">{name} :</div>
            <div className="optionValues">
            {product.options
                .filter(o => o.optionName === name)
                .map(option => (
                <button
                    key={option.optionId}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.stockQty === 0}
                    className={`btn line ${selectedOptions.find(o => o.optionId === option.optionId) ? "active" : ""}`}
                >
                    {option.optionValue}
                </button>
                ))}
            </div>
        </div>
        ))}

        {/* 선택된 옵션 리스트 */}
        <div className="selectedOptions">
        {selectedOptions.map(option => (
            <div className="selectedItem" key={option.optionId}>
                <div className="optionInfo">
                    {product.name} / {addComma(option.optionValue)}
                    <span className="optionPrice">
                    {addComma((product.price + option.optionPrice) * option.quantity)}KRE
                    </span>
                </div>
                <div className="quantityControl">
                    QUANTITY :
                    <button onClick={() => updateQuantity(option.optionId, -1)} className="qtyBtn">-</button>
                    <span className="qty">{option.quantity}</span>
                    <button onClick={() => updateQuantity(option.optionId, 1)} className="qtyBtn">+</button>
                </div>
            </div>
        ))}
        </div>

        {/* 총 가격 */}
        <div className="totalSection">
            <span className="totalLabel">TOTAL : </span>
            <strong className="totalPrice">{addComma(calculateTotal())} KRE</strong>
        </div>

        <div className="payBtn">
            <button type="butoon" className="btn black">PAYMENT {addComma(calculateTotal())} KRE</button>
        </div>

    </div>
    </aside>

  );
};

export default SidebarDetailComponent;
