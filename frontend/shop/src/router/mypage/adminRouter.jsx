import { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const AdminMainPage = lazy(() => import("../../Pages/myPage/admin/AdminMainPage"));
const OrderComponent = lazy(() => import("../../Components/mypage/admin/order/OrderComponent"));
const OrderListComponent = lazy(() => import("../../Components/mypage/admin/order/OrderListComponent"));
const ProductComponent = lazy(() => import("../../Components/mypage/admin/product/ProductComponent"));
const ProductListComponent = lazy(()=>import("../../Components/mypage/admin/product/ProductListComponent"));
const ProductFormComponent = lazy(() => import("../../Components/mypage/admin/product/ProductFormComponent"));
const MemberComponent = lazy(() => import("../../Components/mypage/admin/member/MemberComponent"));
const MemberListCompenet = lazy(() => import("../../Components/mypage/admin/member/MemberListCompoenet"));
const MemberModifyCompoenet = lazy(() => import("../../Components/mypage/admin/member/MemberModifyCompoenet"));
const CategoryCompoenet = lazy(() => import("../../Components/mypage/admin/category/CategoryCompoenet"));
const BoardListComponent = lazy(() => import("../../Components/mypage/admin/board/BoardListComponent"));
const InquiryComponent = lazy(() => import("../../Components/mypage/admin/inquiry/InquiryCompoenet"));
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
            <OrderComponent />
          ),
          children: [
            {
              index: true,  // <- 기본 라우트
              element: <OrderListComponent />
            },
          ]
        },
        {
          path: "product",
          element: (
            <ProductComponent />
          ),
          children:[
            {
              index: true,  // <- 기본 라우트
              element: <ProductListComponent />
            },
            {
              path: "add",
              element :(
                <ProductFormComponent />
              )
            },
            {
              path: "modify/:id",
              element: (
                <ProductFormComponent />
              )
            }
          ]
        },
        {
          path: "member",
          element : (
            <MemberComponent />
          ),
          children:[
            {
              index : true,
              element : (
                <MemberListCompenet />
              )
            },
            {
              path : "modify/:id",
              element : (
                <MemberModifyCompoenet />
              )
            },
          ]
        },
        {
          path: "category",
          element: (
            <CategoryCompoenet />
          ),
        },
        {
          path: "user",
          element: (
            <CategoryCompoenet />
          ),
        },
        {
          path: "board",
          element: (
            <BoardListComponent />
          ),
        },
        {
          path: "inquiry",
          element: (
            <InquiryComponent />
          ),
          children: [
            {
              index: true,  // <- 기본 라우트
              element: <InquiryListComponent />
            },
          ]
        },
      ],
    },
  ];
};

export default adminRouter;
