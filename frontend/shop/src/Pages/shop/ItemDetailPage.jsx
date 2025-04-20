import BasicLayout from "../../layout/BasicLayout";
import ItemDetailSidebar from "./ItemDetailSidebar";

const ItemDetailPage =  () => {


    return(
    <BasicLayout> 
     <div className="ItemDetailBox">
        <ItemDetailSidebar>
        {/* 상품 상세 내용 */}

        {/* 리뷰 */}


        {/* Q&A */}

        {/* SHIPPING&REFUNDS */}
         <div className="SAC">
                <h2>교환 및 반품 주소</h2>
                <p>서울특별시 마포구 서교동 336-6 지하 1층</p>
                <br/>

                <h2>교환 및 반품이 가능한 경우</h2>
                <ol>
                  <li>제품 수령일로부터 7일 이내 (단, 고객의 단순 변심에 의한 교환, 반품 시 왕복 배송비는 고객 부담입니다.)</li>
                  <li>제공된 상품의 내용이 표시, 광고 내용과 다르거나 계약 내용과 다르게 이행된 경우에는 제품 등을 공급받은 날부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내</li>
                </ol>
                <br />

                <h2>교환 및 반품이 불가능한 경우</h2>
                <ol>
                  <li>고객에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우 (단, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외합니다)</li>
                  <li>이용자의 사용 또는 일부 소비로 재화 등의 가치가 현저히 감소한 경우</li>
                  <li>시간의 경과에 의하여 재판매하기 곤란할 정도로 재화 등의 가치가 현저히 감소한 경우</li>
                  <li>개봉된 개별 상품의 경우 (단, 피부 트러블로 인한 반품 시에는 의사의 소견서를 첨부하여야 합니다.)</li>
                  <li>고객 주문에 따라 개별적으로 생산되는 제품 또는 해외 직구 상품 등 청약 철회 시 판매자에게 회복 불가능한 손해가 발생할 경우 (사전 동의 필요)</li>
                  <li>디지털 콘텐츠의 제공이 개시된 경우 (단, 이용하지 않았거나 기술적 오류가 발생한 경우에는 청약 철회가 가능합니다.)</li>
                </ol>
                <p>(※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품 반송 비용은 고객님께서 부담하셔야 합니다. (색상, 사이즈 교환 등 포함))</p>
         </div>
        </ItemDetailSidebar>
     </div>
    </BasicLayout>
      
    )
}

export default ItemDetailPage; 