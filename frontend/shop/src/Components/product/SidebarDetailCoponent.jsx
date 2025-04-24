import { NavLink, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getFormattedPrice } from "../../util/priecUtil";
import { getProductById } from "../../api/productApi";

const SidebarDetailComponent = ({ memberInfo }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    getProductById(productId).then((res) => {
      setProduct(res);
    });
  }, [productId]);

  if (!product) {
    return <div className="itemSidebar">Loading...</div>;
  }

  const formatted = getFormattedPrice(product.price, product.discountRate);
  const uniqueOptionNames = [...new Set(product.options.map(o => o.optionName))];

  const handleOptionClick = (option) => {
    const exists = selectedOptions.find(o => o.optionId === option.optionId);
    if (!exists) {
      setSelectedOptions([...selectedOptions, { ...option, quantity: 1 }]);
    }
  };

  const updateQuantity = (optionId, delta) => {
    setSelectedOptions(prev =>
      prev.map(o =>
        o.optionId === optionId
          ? { ...o, quantity: Math.max(1, o.quantity + delta) }
          : o
      )
    );
  };

  const calculateTotal = () => {
    return selectedOptions.reduce((sum, option) => {
      return sum + ((product.price + option.optionPrice) * option.quantity);
    }, 0);
  };

  return (
    <aside className="itemSidebar">
      <div className="innerSidebarWrap">
        <span>{product.id}</span>
        <h2 className="pageTitle">{product.name}</h2>
        <div>
          <span>{formatted.discounted} KRE</span>
          <span className="original">{formatted.original}</span>
          <span className="discount">{formatted.discountRate}</span>
        </div>
        <div>★ 평점: {product.totalScore}</div>

        {/* 옵션 선택 영역 */}
        {uniqueOptionNames.map(name => (
          <div key={name}>
            <div className="optionTitle">{name} :</div>
            <div className="optionButtons">
              {product.options
                .filter(o => o.optionName === name)
                .map(option => (
                  <button
                    key={option.optionId}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.stockQty === 0}
                    className={selectedOptions.find(o => o.optionId === option.optionId) ? "active" : ""}
                  >
                    {option.optionValue}
                  </button>
                ))}
            </div>
          </div>
        ))}

        {/* 선택된 옵션 정보 */}
        {selectedOptions.map(option => (
          <div className="selectedOption" key={option.optionId}>
            <div className="optionInfo">
              {product.name} / {option.optionValue}
              <span className="optionPrice">
                {(product.price + option.optionPrice) * option.quantity} KRE
              </span>
            </div>
            <div className="quantityControl">
              QUANTITY :
              <button onClick={() => updateQuantity(option.optionId, -1)}>-</button>
              <span>{option.quantity}</span>
              <button onClick={() => updateQuantity(option.optionId, 1)}>+</button>
            </div>
          </div>
        ))}

        {/* 총 가격 */}
        <div>
          <span>TOTAL : </span>
          <strong className="totalPrice">{calculateTotal()} KRE</strong>
        </div>
      </div>
    </aside>
  );
};

export default SidebarDetailComponent;
