import React,{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import BasicLayout from '../../../layout/BasicLayout';
import MyNav from '../../../components/mypage/MyNavComponent';
import MySection from '../../../components/mypage/MySectionComponent';

import { getCookie, setCookie, removeCookie } from "../../../util/cookieUtil";


import '../../../static/css/myNav.scss'
import '../../../static/css/mypage.scss'

const AdminMainPage =()=>{
  const navigate = useNavigate();
  const loginState = useSelector(state => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';
  const [memberInfo, setInfo] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const info = getCookie("member");
      setInfo(info);
    } else {
      setInfo(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    // memberInfo는 쿠키 파싱 결과라서, 로딩 지연을 고려해야 함
    if (memberInfo && (!Array.isArray(memberInfo.roleNames) || !memberInfo.roleNames.includes("ADMIN"))) {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/");
    }
  }, [isLoggedIn, memberInfo, navigate]);

  if (!isLoggedIn || !memberInfo) return null; // 렌더링 차단 (필요 시 로딩 처리 가능)

    console.log(memberInfo)


    return(
        <BasicLayout>
            <div className="mypageWrap">
                <MyNav/>
                <MySection/>
            </div>
        </BasicLayout>
    )
}
export default AdminMainPage;