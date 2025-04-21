import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";
import { fetchItems } from "../../api/categoryItemApi";
import "../../static/css/shop.scss";
import "../../static/css/siderbar.scss";


const ItemListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);


  const category = searchParams.get("category") || "1"; // 기본값 '1'
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "9", 10);
  
  // API 호출
  useEffect(() => {
    fetchItems(category, page, size).then(data => {
      setItems(data.content);
      setTotalElements(data.totalElements);
    });
  }, [category, page, size]);


  const handleAddCart = (id, event) => {
    event.stopPropagation();
    console.log("장바구니 추가:", id);
  };

  const handleAddWishlist = (id, event) => {
    event.stopPropagation();
    console.log("관심상품 추가:", id);
  };

  const handleCategoryClick = (cat) => {
    updateParams({ category: cat, page: 1 });
  };

  const handleSortButtonClick = (sortType) => {
    updateParams({ sort: sortType, page: 1 });
  };

  const totalPages = Math.ceil(totalElements / size);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <BasicLayout>
      <div className="itemListContainer">
        <div className="itemListSection">
          {items.map((item) => (
            <div
              key={item.id}
              className="itemCard"
              onClick={() => navigate(`/item/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="itemImageWrapper">
                <img
                  src={`/images/${item.uploadFileNames?.[0] || "default.png"}`}
                  alt={item.name}
                  className="itemImage"
                />
                <div className="itemButtonGroup">
                  <button onClick={(e) => handleAddWishlist(item.id, e)}>WISH</button>
                  <button onClick={(e) => handleAddCart(item.id, e)}>CART</button>
                </div>
              </div>
              <div className="itemInfo">
                <div className="itemName">{item.name}</div>
                <div className="space">
                  <div className="itemSalePrice">
                    {Math.floor(item.price * (1 - item.discountRate / 100))}KR
                  </div>
                  <div className="itemOriginalPrice">{item.price}KWR</div>
                  <div className="itemDiscount">{item.discountRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="itemSidebar">
          <div className="innerSiedbarWrap">
            <h1 className="categoryTitle">SHOP</h1>

            <div className="searchBox">
              <input type="text" placeholder="SEARCH TEXT" />
              <button>SEARCH</button>
            </div>

            {/* <div className="categoryBox">
              <ul className="categoryList">
                {["OUTWEAR", "TOP", "KNITWEAR", "BOTTOM", "ACC"].map((cat) => (
                  <li
                    key={cat}
                    className={category === cat ? "active" : ""}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div> */}

            {/* <div className="paginationSection">
              <div className="totalCount">TOTAL {totalElements}</div>
              <div className="sortButtons">
                {["NEWEST", "PRICE HIGH", "PRICE LOW"].map((type) => (
                  <button
                    key={type}
                    className={sort === type ? "active" : ""}
                    onClick={() => handleSortButtonClick(type)}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>

              <div className="pageLinks">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Link
                    key={i + 1}
                    to={`?page=${i + 1}&category=${category}&sort=${sort}`}
                    className={page === i + 1 ? "current" : ""}
                  >
                    {i + 1}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link to={`?page=${page + 1}&category=${category}&sort=${sort}`}>
                    NEXT
                  </Link>
                )}
              </div>
            </div> */}
          </div>
        </aside>
      </div>
    </BasicLayout>
  );
};

export default ItemListPage;