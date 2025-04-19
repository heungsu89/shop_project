import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Outlet } from "react-router-dom";


const ProductComponent = () =>{
    return(
        <div className="myPageComponent">
            <div className="tablePage">
                <Outlet />
            </div>
        </div>
    )
}
export default ProductComponent;