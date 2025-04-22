import { NavLink } from "react-router-dom";
import Pagination from "../../Components/Pagination";

const Sidebar = ({items,childCategorys,categoryName,page,size}) => {
    return(
        <aside className="itemSidebar">
            <div className="innerSiedbarWrap">

            <h2 className="categoryTitle">{categoryName}</h2>

            <div className="searchBox">
                <input type="text" placeholder="SEARCH TEXT" />
                <button type="button" className="btn black">SEARCH</button>
            </div>

            <nav>
                <ul className="categoryList">
                    {childCategorys?.map((category) => (
                        <li key={category.categoryId}>
                        <NavLink 
                        to={`/product/list/${category.categoryId}?page=${page}&size=${size}`}
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
    )
}
export default Sidebar;