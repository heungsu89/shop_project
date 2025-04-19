import { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const AdminMainPage = lazy(() => import("../../Pages/myPage/admin/AdminMainPage"));
const OrderListComponent = lazy(() => import("../../Components/mypage/admin/order/OrderListComponent"));
const ProductComponent = lazy(() => import("../../Components/mypage/admin/product/ProductCompornt"));
const ProductAddComponent = lazy(() => import("../../Components/mypage/admin/product/ProductAddComponent"));
const CategoryCompoenet = lazy(() => import("../../Components/mypage/admin/category/CategoryCompoenet"));
const BoardListComponent = lazy(() => import("../../Components/mypage/admin/board/BoardListComponent"));
const InquiryListComponent = lazy(() => import("../../Components/mypage/admin/inquiry/InquiryListCompoenet"));

const adminRouter = () => {
  return [
    {
      path: "mypage",
      element: (
        <Suspense fallback={<Loading />}><AdminMainPage /></Suspense>
      ),
      children: [
        {
          path: "order",
          element: (
            <Suspense fallback={<Loading />}><OrderListComponent /></Suspense>
          ),
        },
        {
          path: "product",
          element: (
            <Suspense fallback={<Loading />}><ProductComponent /></Suspense>
          ),
          children:[
            {
              path: "add",
              element :(
                <Suspense fallback={<Loading />}><ProductAddComponent /></Suspense>
              )
            }
          ]
        },
        {
          path: "category",
          element: (
            <Suspense fallback={<Loading />}><CategoryCompoenet /></Suspense>
          ),
        },
        {
          path: "board",
          element: (
            <Suspense fallback={<Loading />}><BoardListComponent /></Suspense>
          ),
        },
        {
          path: "inquiry",
          element: (
            <Suspense fallback={<Loading />}><InquiryListComponent /></Suspense>
          ),
        },
      ],
    },
  ];
};

export default adminRouter;
