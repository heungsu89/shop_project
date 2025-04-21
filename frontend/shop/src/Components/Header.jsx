import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Logo from '../static/svg/logo.svg?react';
import LogoutComponent from './member/LogoutComponent';
import { getCookie, removeCookie } from "../util/cookieUtil";
import { categoryList } from '../api/categoryApi';

const Header = ({ isMypage }) => {
  const navigate = useNavigate();
  const loginState = useSelector(state => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';
  const [memberInfo, setInfo] = useState(null);
  const [categories, setCategories] = useState([]);

  /** 동적으로 생성된 카테고리 불러오기기 */
  const fetchCategories = useCallback(() => {
    categoryList().then(setCategories);
  }, []);

  /** 로그인 정보 확인 및 동적 카테고리 감지 업데이트 */
  useEffect(() => {
    fetchCategories();

    if (isLoggedIn) {
      const info = getCookie("member");
      setInfo(info);
    } else {
      setInfo(null);
    }

    const handleUpdate = () => fetchCategories();
    window.addEventListener('categoryUpdated', handleUpdate);

    return () => window.removeEventListener('categoryUpdated', handleUpdate);
  }, [isLoggedIn, fetchCategories]);

  const handleLogout = () => {
    removeCookie("member");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  /** 관리자, 일반유저 인지 따라 링크 다르게 하기 */
  const mypageLink = memberInfo?.roleNames?.includes("ADMIN") ? "/admin/mypage" : "/mypage";

  return (
    <header className="header">
      <div className={`innerWrap ${isMypage ? 'mypage' : ''}`}>
        <h1 className="logo">
          <Link to="/">
            <Logo />
            <strong className="blind">NØRD</strong>
          </Link>
        </h1>

        <nav className="gnb">
          <ul className="cartegory">
            {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/shop/category/${cat.id}`}>{cat.categoryName}</Link>
                </li>
              ))}
            <li><Link to="/shop">SHOP</Link></li>
            <li><Link to="/magazine">MAGAZINE</Link></li>
            <li><Link to="/event">EVENT</Link></li>
          </ul>
        </nav>

        <div className="utillMenu">
          <ul>
            {/* 로그인 상태 여부에 따라 링크 변환 */}
            <li><Link to="/search">SEARCH</Link></li>
            <li><Link to={isLoggedIn ? "/cart" : "/member/login"}>CART</Link></li>
            <li><Link to={isLoggedIn ? mypageLink : "/member/login"}>MYPAGE</Link></li>
            {isLoggedIn ? (
              <li><LogoutComponent /></li>
            ) : (
              <li><Link to="/member/login">LOGIN</Link></li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
