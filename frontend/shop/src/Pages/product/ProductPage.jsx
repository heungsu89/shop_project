import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchItems } from "../../api/categoryItemApi";
import { getCategories } from "../../api/categoryApi";
import { getCookie } from "../../util/cookieUtil";
import BasicLayout from "../../layout/BasicLayout";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/product/SidebarComponent";

import "../../static/css/shop.scss";
import "../../static/css/siderbar.scss";


const ProductPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "9", 10);

  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [childCategories, setChildCategories] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);

  const loginState = useSelector((state) => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';

  useEffect(() => {
    if (isLoggedIn) {
      const info = getCookie("member");
      setMemberInfo(info);
    } else {
      setMemberInfo(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchItems(categoryId, page, size).then(setItems);
  }, [categoryId, page, size]);

  useEffect(() => {
    const loadCategoryData = async () => {
      const current = await getCategories(categoryId);
      setCategoryName(current.categoryName);
      if (current?.parentId) {
        const parent = await getCategories(current.parentId);
        setChildCategories(parent.child);
      } else {
        setChildCategories(current.child || []);
      }
    };
    if (categoryId) loadCategoryData();
  }, [categoryId]);



  return (
    <BasicLayout>
      <div className="productWrap">
        <div className="productContainer">
          <Outlet context={{ loginState, items, categoryId }} />
        </div>
        {items && <Sidebar items={items} childCategorys={childCategories} categoryName={categoryName} page={page} size={size}/>}
      </div>
    </BasicLayout>
  );
};

export default ProductPage;