import { Outlet } from "react-router-dom";

const ProfileComponent = () => {
  return(
    <div className="myPageComponent">
        <Outlet />
    </div>
  )
}

export default ProfileComponent;