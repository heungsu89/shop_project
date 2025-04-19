import { NavLink } from 'react-router-dom';

const MyNav = () => {
  const pageParam = `/?page=0&size=10`;


  return (
    <aside className='myNavWrap'>
      <div className="asideNav">
        <h2>ADMIN</h2>
        <div className="userRollInfo">
          <strong>관리자</strong>
          <p>오늘도 화이팅하세요.</p>
        </div>

        <nav className="userNav">
          <ul>
            <li><NavLink to="/admin/mypage/order">주문</NavLink></li>
            <li><NavLink to="/admin/mypage/inquiry">문의</NavLink></li>
            <li><NavLink to={`/admin/mypage/product${pageParam}`}>상품</NavLink></li>
            <li><NavLink to="/admin/mypage/category">분류</NavLink></li>
            <li><NavLink to="/admin/mypage/member">회원</NavLink></li>
            <li><NavLink to="/admin/mypage/event">이벤트</NavLink></li>
            <li><NavLink to="/admin/mypage/magazine">메거진</NavLink></li>
            <li><NavLink to="/admin/mypage/adminInfo">관리자정보</NavLink></li>
          </ul>
        </nav>
      </div>
    </aside>
  )
};

export default MyNav;
