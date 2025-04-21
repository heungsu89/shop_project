import BasicLayout from "../../layout/BasicLayout";
import ItemDetailSidebar from "./ItemDetailSidebar";
import ItemTabs from "../../Components/itemDetail/ItemTabs";

const ItemDetailPage =  () => {

    return(
      <BasicLayout>
      <div className="ItemDetailBox">
        <ItemDetailSidebar />
        <ItemTabs /> {/* tabs에서 4개 선택 모두 처리 */}
      </div>
    </BasicLayout>
    )
}

export default ItemDetailPage; 