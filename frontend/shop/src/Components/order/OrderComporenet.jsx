import React, { useState, useEffect } from "react";
import { orderAdd } from "../../api/order";
import { fetchCartItems } from "../../api/cartApi";
import { addComma } from "../../util/priecUtil";
import AddressSearch from "../AddressSearch";
import "../../static/css/order.scss";
import "../../static/css/siderbar.scss";

const OrderComponent = ({ memberInfo }) => {
    const [cartItems, setCartItems] = useState([]);
    const [usePayerMemberInfo, setUsePayerMemberInfo] = useState(true);
    const [useRecipientMemberInfo, setUseRecipientMemberInfo] = useState(true);
    const [payer, setPayer] = useState({
      payerName: memberInfo.memberName,
      payerNumber: memberInfo.phoneNumber,
      orderRequest: ""
    });
    const [recipient, setRecipient] = useState({
      recipientName: memberInfo.memberName,
      recipientNumber: memberInfo.phoneNumber,
      zipCode: memberInfo.address.zip_code,
      defaultAddress: memberInfo.address.default_address,
      detailedAddress: memberInfo.address.detailed_address
    });
    const [paymentMethod, setPaymentMethod] = useState("CARD");
    const [mileageStatus, setMileageStatus] = useState("NO_REDEEM");
    const [usingMileage, setUsingMileage] = useState(0);
  
    useEffect(() => {
      fetchCartItems(memberInfo.id).then(setCartItems);
    }, [memberInfo]);
  
    useEffect(() => {
      if (usePayerMemberInfo) {
        setPayer({
          payerName: memberInfo.memberName,
          payerNumber: memberInfo.phoneNumber,
          orderRequest: ""
        });
      } else {
        setPayer({
          payerName: "",
          payerNumber: "",
          orderRequest: ""
        });
      }
    }, [usePayerMemberInfo, memberInfo]);
  
    useEffect(() => {
      if (useRecipientMemberInfo) {
        setRecipient({
          recipientName: memberInfo.memberName,
          recipientNumber: memberInfo.phoneNumber,
          zipCode: memberInfo.address.zip_code,
          defaultAddress: memberInfo.address.default_address,
          detailedAddress: memberInfo.address.detailed_address
        });
      } else {
        setRecipient({
          recipientName: "",
          recipientNumber: "",
          zipCode: "",
          defaultAddress: "",
          detailedAddress: ""
        });
      }
    }, [useRecipientMemberInfo, memberInfo]);
  
    const handleAddressChange = (zip, def, detail) => {
      setRecipient(prev => ({
        ...prev,
        zipCode: zip,
        defaultAddress: def,
        detailedAddress: detail
      }));
    };
  
    const totalAmount = cartItems.reduce((sum, item) => sum + item.itemPrice * item.qty, 0);
    const mileage = Math.floor(totalAmount * 0.01);
    const shippingFee = totalAmount >= 100000 ? 0 : 3000;
    const finalAmount = totalAmount + shippingFee - (mileageStatus === "REDEEM" ? usingMileage : 0);
  

    const handleOrderSubmit = () => {
        const orderData = {
            memberId: memberInfo.id,
            payerName: payer.payerName,
            payerNumber: payer.payerNumber,
            orderRequest: payer.orderRequest,
            paymentMethod,
            mileageStatus,
            usingMileage,
            recipientName: recipient.recipientName,
            recipientNumber: recipient.recipientNumber,
            recipient_zip_code: recipient.zipCode,
            recipient_default_address: recipient.defaultAddress,
            recipient_detailed_address: recipient.detailedAddress
          };
    
        console.log("전송할 주문 데이터:", orderData);
        orderAdd(orderData).then()
        
        // 실제 API 전송은 여기에 fetch 또는 axios 등으로 구현
      };
  return (
    <>
    <div className="rightNavLayoutContainer">
      <div className="innerWrap orderContent">
        <h2>ORDER</h2>

        <section className="borderSection orderItemSection">
          <h3>주문상품목록</h3>
          <div className="tablePage">
            <div className="itemTableWrap">
              <table className="itemTable">
                <thead className="itemThead">
                  <tr className="itemTr">
                    <th className="itemInfo">상품</th>
                    <th className="itemPriceInfo">단품가격</th>
                    <th className="itemPriceInfo">주문금액</th>
                    <th className="itemTotalScore">적립금</th>
                  </tr>
                </thead>
                <tbody className="itemTbody">
                  {cartItems.map((item, idx) => (
                    <tr className="itemTr" key={idx}>
                      <td className="itemInfo">
                        <div className="itemImg">
                          <img src={`http://localhost:8081/upload/${item.imageName}`} alt={item.itemName} />
                        </div>
                        <div className="itemInfo">
                          <p>{item.itemName}</p>
                          <p>{item.optionName} : {item.optionValue} (수량 : {item.qty})</p>
                        </div>
                      </td>
                      <td className="itemPriceInfo">{addComma(item.itemPrice)}</td>
                      <td className="itemPriceInfo">{addComma(item.itemPrice * item.qty)}</td>
                      <td className="itemTotalScore">{addComma(Math.floor(item.itemPrice * item.qty * 0.01))}P</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="borderSection payerInfoSection">
          <h3>주문자 정보</h3>
          <div>
            <label><input type="radio" checked={usePayerMemberInfo} onChange={() => setUsePayerMemberInfo(true)} />회원 정보와 동일</label>
            <label><input type="radio" checked={!usePayerMemberInfo} onChange={() => setUsePayerMemberInfo(false)} />주문자 정보 변경</label>
          </div>
          <div className='inputWrap'>
            <div className="inputTitle"><span className='point'>[필수]</span>주문자명</div>
            <div className="inputBox">
              <input
                name="payerName"
                value={usePayerMemberInfo ? memberInfo.memberName : payer.payerName}
                onChange={e => setPayer({ ...payer, payerName: e.target.value })}
                placeholder="주문자명을 입력해주세요."
                type="text"
              />
            </div>
          </div>
          <div className='inputWrap'>
            <div className="inputTitle"><span className='point'>[필수]</span>연락처</div>
            <div className="inputBox">
              <input
                name="payerNumber"
                value={usePayerMemberInfo ? memberInfo.phoneNumber : payer.payerNumber}
                onChange={e => setPayer({ ...payer, payerNumber: e.target.value })}
                placeholder="'-'를 빼고 입력해주세요."
                type="text"
              />
            </div>
          </div>
          <div className='inputWrap'>
            <div className="inputTitle">주문시 요청사항</div>
            <div className="inputBox">
              <textarea value={payer.orderRequest} onChange={e => setPayer({ ...payer, orderRequest: e.target.value })} placeholder="주문 요청사항을 적어주세요."></textarea>
            </div>
          </div>
        </section>

        <section className="borderSection recipientInfoSection">
          <h3>배송지 정보</h3>
          <div className="inputBox">
            <label><input type="radio" checked={useRecipientMemberInfo} onChange={() => setUseRecipientMemberInfo(true)} />회원 정보와 동일</label>
            <label><input type="radio" checked={!useRecipientMemberInfo} onChange={() => setUseRecipientMemberInfo(false)} />새로운 주소</label>
          </div>
          <div className='inputWrap'>
            <div className="inputTitle"><span className='point'>[필수]</span>수령인</div>
            <div className="inputBox">
              <input
                value={useRecipientMemberInfo ? memberInfo.memberName : recipient.recipientName}
                onChange={e => setRecipient({ ...recipient, recipientName: e.target.value })}
                placeholder="수령인 성함을 입력해주세요."
                type="text"
              />
            </div>
          </div>
          <div className='inputWrap'>
            <div className="inputTitle"><span className='point'>[필수]</span>연락처</div>
            <div className="inputBox">
              <input
                value={useRecipientMemberInfo ? memberInfo.phoneNumber : recipient.recipientNumber}
                onChange={e => setRecipient({ ...recipient, recipientNumber: e.target.value })}
                placeholder="수령인 연락처를 입력해주세요."
                type="text"
              />
            </div>
          </div>
          <div className='inputWrap'>
            <div className="inputTitle"><span className='point'>[필수]</span>수령인 주소</div>
            <AddressSearch onComplete={handleAddressChange} setingAddress={recipient} />
          </div>
        </section>

        <section className="borderSection">
          <h3>결제방법</h3>
          <div>
            <label><input type="radio" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod("CARD")} />카드결제</label>
            <label><input type="radio" checked={paymentMethod === 'NO_BANKBOOK'} onChange={() => setPaymentMethod("NO_BANKBOOK")} />무통장 입금</label>
          </div>

          {paymentMethod === 'NO_BANKBOOK' && (
            <div className="bankInfo">
              <strong>무통장 입금안내</strong>
              <p><strong>예금주 : 스카디 어패럴</strong> <strong>계좌번호 : 0000-000000-000000</strong></p>
              <ul>
                <li>무통장 입금으로 주문시 7일 이내에 입금하셔야 상품 준비 및 발송이 시작됩니다.</li>
                <li>무통장 입금으로 주문시 7일 이내에 미 입금시 주문이 자동 취소 됩니다.</li>
                <li>무통장 입금시 입금 대상과 계좌번호를 꼭 확인해주세요. 고객님의 실수로 인한 송금 사고는 책임 지지 않습니다.</li>
                <li>무통장 입금시 송금인의 성함을 꼭 확인해주세요. 주문 취소 및 배송지연이 될 수 있습니다.</li>
              </ul>
            </div>
          )}
        </section>

        <section className="borderSection">
          <h3>마일리지</h3>
          <div>
            <label><input type="radio" checked={mileageStatus === 'NO_REDEEM'} onChange={() => setMileageStatus("NO_REDEEM")} />미사용</label>
            <label><input type="radio" checked={mileageStatus === 'REDEEM'} onChange={() => setMileageStatus("REDEEM")} />사용</label>
          </div>
          {mileageStatus === 'REDEEM' && (
            <div className='inputWrap'>
              <div className="inputTitle">마일리지 사용 <span className='point'>(100P 단위로 사용 가능)</span></div>
              <div className="inputBox">
                <input
                  type="number"
                  value={usingMileage}
                  onChange={e => setUsingMileage(Number(e.target.value))}
                  placeholder="사용할 마일리지 포인트 입력"
                />
              </div>
            </div>
          )}
        </section>

        <section className="borderSection">
          <h3>배송안내</h3>
          <div>
            <p>10만원 이상 구매시 배송비는 무료입니다.</p>
            <p>배송 기본 가격은 3,000원입니다.</p>
          </div>
        </section>
      </div>

      
    </div>
    <aside className="itemSidebar">
      <div className="innerSiedbarWrap">
        <div><strong>주문금액</strong><strong>{addComma(totalAmount)}원</strong></div>
        <div><strong>마일리지</strong><strong>{addComma(mileage)}P</strong></div>
        <div><strong>배송비</strong><strong>+{addComma(shippingFee)}원</strong></div>
        <div><span>총 결제 금액</span><strong>{addComma(finalAmount)}원</strong></div>
        <button type="button" onClick={handleOrderSubmit}>총 결제 ({addComma(finalAmount)}원)</button>
      </div>
    </aside>
  </>
  );
};

export default OrderComponent;
