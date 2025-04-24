import React,{ useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { memberIdSearch } from '../../api/memberApi';
import BasicLayout from "../../layout/BasicLayout";
import OrderComponent from '../../Components/order/OrderComporenet';

const OrderPage =()=>{
  const loginState = useSelector(state => state.loginSlice);
  const isLoggedIn = loginState && loginState.email !== '';
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
        memberIdSearch(loginState.memberId).then(res => {
            setMemberInfo(res);
        });
    } else {
        alert("로그인이 필요합니다.");
        setMemberInfo(null);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || !memberInfo) return null; // 렌더링 차단 (필요 시 로딩 처리 가능)


    return(
      <BasicLayout>
        <div className="rightNavLayoutWrap">
        {memberInfo &&
          <OrderComponent memberInfo={memberInfo}/>
        }
        </div>
      </BasicLayout>
    )
}
export default OrderPage;