import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import memberRouter from "./memberRouter";
import adminRouter from "./mypage/adminRouter";

const Loading = <div>Loading....</div>;
const Main = lazy(() => import("../Pages/main/MainPage"));
const Guide = lazy(() => import("../Pages/footer/GuidePage"));
const Privacy = lazy(() => import("../Pages/footer/PrivacyPolicyPage"));
const Terms =  lazy(() => import("../Pages/footer/TermsPage"));
const Shop = lazy(()=>import("../Pages/shop/ItemListPage"))
const CategoryPage = lazy(() => import("../Pages/shop/CategoryPage"));
const CategorCopyPage = lazy(() => import("../Pages/shop/CategoryCopyPage"));
// 🔸 이건 라우터 설정만 담은 객체
const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: "shop",
    children: [
      {
        index: true, // /shop
        element: <Suspense fallback={Loading}><Shop/></Suspense>
      },
      {
        path: "category/:categoryId", // /shop/category/123
        element: <Suspense fallback={Loading}><CategoryPage/></Suspense>
      },
      {
        path: "categoryCopy/:categoryId", // /shop/category/123
        element: <Suspense fallback={Loading}><CategorCopyPage/></Suspense>
      }
    ]
  },
  {
    path: "guide",
    element: <Suspense fallback={Loading}><Guide/></Suspense>
  },
  {
    path: "privacy",
    element: <Suspense fallback={Loading}><Privacy/></Suspense>
  },
  {
    path: "terms",
    element: <Suspense fallback={Loading}><Terms/></Suspense>
  },
  {
    path: "member",
    children: memberRouter()
  },
  {
    path: "admin",
    children: adminRouter()
  },
]);

const Root = () => {
  return <RouterProvider router={rootRouter} />;
};

export default Root;