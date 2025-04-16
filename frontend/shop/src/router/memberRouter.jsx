import { Suspense, lazy } from "react";
const Loading = <div>Loading....</div>
const Login =  lazy(() => import("../Pages/member/LoginPage"));
const KakaoRedirectPage = lazy(() => import("../Pages/member/KakaoRedirevtPage"));
const Signup = lazy(() => import("../Pages/member/SignupPage"));

const memberRouter = () => {

  return [
    {
        path:"login",
        element: <Suspense fallback={Loading}><Login/></Suspense>
    },
    {
        path:"kakao",
        element : <Suspense fallback={Loading}><KakaoRedirectPage/></Suspense>
    },
    {
      path:"signup",
      element : <Suspense fallback={Loading}><Signup/></Suspense>
    }
  ]
}

export default memberRouter;