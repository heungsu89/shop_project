import { Link, useSearchParams, useNavigate } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";
import '../../static/css/shop.scss';
import '../../static/css/siderbar.scss';
import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemListPage = () => {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(() => new URLSearchParams(window.location.search).get('category') || "OUTWEAR");
  const [activeSortButton, setActiveSortButton] = useState(() => new URLSearchParams(window.location.search).get('sort') || "NEWEST");
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8081/api/items/listPage`, {
        params: {
          page: currentPage - 1,
          category: activeCategory,
          sort: activeSortButton,
          size: itemsPerPage
        }
      });
      setItems(response.data.content || []);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("상품 목록을 불러오는데 실패했습니다.", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, activeCategory, activeSortButton]);

  const handleAddCart = (id) => {
    console.log("장바구니 추가:", id);
  };

  const handleAddWishlist = (id) => {
    console.log("관심상품 추가:", id);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchParams({ page: 1, category: category, sort: activeSortButton });
  };

  const handleSortButtonClick = (sortType) => {
    setActiveSortButton(sortType);
    setSearchParams({ page: 1, category: activeCategory, sort: sortType });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <BasicLayout>
      <div className="itemListContainer">
        <div className="itemListSection">
          {items.map((item) => (
            <div key={item.id} className="itemCard">
              <div className="itemImageWrapper">
                <img
                  src={`/images/${item.uploadFileNames?.[0] || 'default.png'}`}
                  alt={item.name}
                  className="itemImage"
                />
                <div className="itemButtonGroup">
                  <button onClick={() => handleAddWishlist(item.id)}>WISH</button>
                  <button onClick={() => handleAddCart(item.id)}>CART</button>
                </div>
              </div>
              <div className="itemInfo">
                <div className="itemName">{item.name}</div>
                <div className="space">
                  <div className="itemSalePrice">
                    {Math.floor(item.price * (1 - item.discountRate / 100))}KR
                  </div>
                  <div className="itemOriginalPrice">{item.price}KR</div>
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

            <div className="categoryBox">
              <ul className="categoryList">
                {["OUTWEAR", "TOP", "KNITWEAR", "BOTTOM", "ACC"].map((cat) => (
                  <li
                    key={cat}
                    className={activeCategory === cat ? 'active' : ''}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="paginationSection">
              <div className="totalCount">TOTAL {totalElements}</div>
              <div className="sortButtons">
                {["NEWEST", "PRICE HIGH", "PRICE LOW"].map((type) => (
                  <button
                    key={type}
                    className={activeSortButton === type ? "active" : ""}
                    onClick={() => handleSortButtonClick(type)}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>

              <div className="pageLinks">
                {Array.from({ length: Math.ceil(totalElements / itemsPerPage) }, (_, i) => (
                  <Link
                    key={i + 1}
                    to={`?page=${i + 1}${activeCategory !== 'OUTWEAR' ? `&category=${activeCategory}` : ''}${activeSortButton !== 'NEWEST' ? `&sort=${activeSortButton}` : ''}`}
                    className={currentPage === i + 1 ? 'current' : ''}
                  >
                    {i + 1}
                  </Link>
                ))}
                {currentPage < Math.ceil(totalElements / itemsPerPage) && (
                  <Link
                    to={`?page=${currentPage + 1}${activeCategory !== 'OUTWEAR' ? `&category=${activeCategory}` : ''}${activeSortButton !== 'NEWEST' ? `&sort=${activeSortButton}` : ''}`}
                  >
                    NEXT
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </BasicLayout>
  )
}

export default ItemListPage;