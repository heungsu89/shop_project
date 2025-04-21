import BasicLayout from "../../layout/BasicLayout";
import ItemDetailSidebar from "./ItemDetailSidebar";
import ItemTabs from "../../Components/itemDetail/ItemTabs";
import ItemShippingRefund from "./ItemShippingRefund";
import ItemQnA from "./ItemQnA";
import ItemReview from "./ItemReview";

const ItemDetailPage =  () => {


    return(
    <BasicLayout> 
     <div className="ItemDetailBox">
        <ItemDetailSidebar>
        {/* 상품 상세 내용 */}
        <ItemTabs/>

        {/* 리뷰 */}
        <ItemTabs/>
        <ItemReview/>

        {/* Q&A */}
        <ItemTabs/>
        <ItemQnA/>

        {/* SHIPPING&REFUNDS */}
        <ItemTabs/>
        <ItemShippingRefund/>

        </ItemDetailSidebar>
     </div>
    </BasicLayout>
      
    )
}

export default ItemDetailPage; 