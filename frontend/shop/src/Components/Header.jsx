import React,{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector} from "react-redux";
import Logo from '../static/svg/logo.svg?react';
import LogoutComponent from './member/LogoutComponent';
import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";
import { categoryList } from '../api/categoryApi';

const Header = ({ isMypage }) => {
  const navigate = useNavigate();
  const loginState = useSelector(state => state.loginSlice)
  const isLoggedIn = loginState && loginState.email !== '';
  const [memberInfo, setInfo] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  
    const handleUpdate = () => {
      fetchCategories(); // 다시 가져오기
    }
  
    window.addEventListener('categoryUpdated', handleUpdate);
  
    return () => {
      window.removeEventListener('categoryUpdated', handleUpdate);
    }
  }, []);

  const fetchCategories = () => {
    categoryList().then(data => {
      setCategories(data);
    });
  };
  

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    removeCookie("member");  // 쿠키 삭제
    navigate("/login");
  }
  useEffect(() => {
    if (isLoggedIn) {
      const info = getCookie("member");
      setInfo(info);
    } else {
      setInfo(null);
    }
  }, [isLoggedIn]);
  
  const mypageLink = memberInfo?.roleNames?.includes("ADMIN") ? "/admin/mypage" : "mypage";

  
  return (
    <header className='header'>
      <div className={`innerWrap ${isMypage ? 'mypage' : ''}`}>
          <h1 className='logo'>
            <Link to="/">
              <Logo/>
              <strong className='blind'>NØRD</strong>
            </Link>
          </h1>
          <nav className="gnb">
            <ul className="cartegory">
            {categories.length > 0 && categories.map((data) => (
              <li key={data.id}>
                  <Link to={`/shop/category/${data.id}`}>{data.categoryName}</Link>
                </li>
            ))}

              <li><Link to="/shop">SHOP</Link></li>
              <li><Link to="/magazine">MAGAZINE</Link></li>
              <li><Link to="/event">EVENT</Link></li>
            </ul>
          </nav>

          <div className="utillMenu">
          
          {isLoggedIn ? (
            //로그인 됬을 때
            <ul>
              <li><Link to="/search">SEARCH</Link></li>
              <li><Link to="/cart">CART</Link></li>
              <li><Link to={mypageLink}>MYPAGE</Link></li>
              <li><LogoutComponent></LogoutComponent></li>
            </ul>
            ):(
              //로그인 안됬을 때
            <ul>
                <li><Link to="/search">SEARCH</Link></li>
                <li><Link to="/member/login">CART</Link></li>
                <li><Link to="/member/login">MYPAGE</Link></li>
                <li><Link to="/member/login">LOGIN</Link></li>
            </ul>
            )}
          </div>
      </div>
    </header>
  );
}

export default Header;
