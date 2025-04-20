import React, { useState, useEffect } from 'react';

function ItemDetailSidebar({ itemId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItemDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8081/api/items/${itemId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setItem(data);
      } catch (e) {
        console.error("상품 상세 정보 로딩 실패:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetail();
  }, [itemId]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) setQuantity(prevQuantity => prevQuantity - 1);
  };

  const calculateTotalPrice = () => {
    return item?.price ? item.price * (1 - (item.discountRate || 0) / 100) * quantity : 0;
  };

  if (loading) return <aside className="productDetailSidebar">로딩 중...</aside>;
  if (error) return <aside className="productDetailSidebar">에러 발생: {error.message}</aside>;
  if (!item) return <aside className="productDetailSidebar">상품 정보 없음</aside>;

  return (
    <aside className="productDetailSidebar">
      <div className="sidebarInner">
        <div className="productCode">NO.{item.id}</div>
        <div className="wishlistButton"><button>WISH</button></div>
        <div className="addToCartButton"><button>ADD CART</button></div>
        <h1 className="sidebarTitle">{item.name}</h1>
        <div className="sidebarPrice">
          <span className="salePrice">{item.price * (1 - (item.discountRate || 0) / 100)}KR</span>
          {item.discountRate > 0 && <span className="originalPrice">{item.price}KR</span>}
          {item.discountRate > 0 && <span className="discount">{item.discountRate}%</span>}
        </div>
        <div className="rating">평점: {item.totalScore}</div>
        <div className="mileage">MILEAGE : 65P</div>
        {item.options?.filter(option => option.optionName === '사이즈').length > 0 && (
          <div className="sizeOptions">
            <h3>SIZE</h3>
            <div className="sizeButtons">
              {item.options.filter(option => option.optionName === '사이즈').map(sizeOption => (
                <button
                  key={sizeOption.optionValue}
                  className={selectedSize === sizeOption.optionValue ? 'selected' : ''}
                  onClick={() => handleSizeClick(sizeOption.optionValue)}
                >
                  {sizeOption.optionValue}
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedSize && (
          <div className="selectedOptions">
            <div className="selectedItem">{item.name} / {selectedSize}</div>
            <div className="quantityControl">
              QUANTITY
              <button onClick={handleQuantityDecrement}>-</button>
              <span>{quantity}</span>
              <button onClick={handleQuantityIncrement}>+</button>
            </div>
          </div>
        )}
        <div className="totalPrice">TOTAL: {calculateTotalPrice()}KR</div>
        <div className="paymentButton"><button>PAYMENT({calculateTotalPrice()}KR)</button></div>
      </div>
    </aside>
  );
}

export default ItemDetailSidebar;