import { Outlet } from "react-router-dom";

const MemberCompoenet = () =>{
    return(
        <div className="myPageComponent">
            <Outlet />
        </div>
    )
}
export default MemberCompoenet;