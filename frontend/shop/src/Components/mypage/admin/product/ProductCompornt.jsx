import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Outlet } from "react-router-dom";


const ProductComponent = () =>{
    return(
        <div className="myPageComponent">
            <Outlet />
        </div>
    )
}
export default ProductComponent;