import { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const AdminMainPage = lazy(() => import("../../Pages/myPage/admin/AdminMainPage"));
const OrderListComponent = lazy(() => import("../../Components/mypage/admin/order/OrderListComponent"));
const ProductComponent = lazy(() => import("../../Components/mypage/admin/product/ProductCompornt"));
const ProductListComponent = lazy(()=>import("../../Components/mypage/admin/product/ProductListComponent"));
const ProductFormComponent = lazy(() => import("../../Components/mypage/admin/product/ProductFormComponent"));
const MemberCompenet = lazy(() => import("../../Components/mypage/admin/member/MemberCompoenet"));
const MemberListCompenet = lazy(() => import("../../Components/mypage/admin/member/MemberListCompoenet"));
const MemberModifyCompoenet = lazy(() => import("../../Components/mypage/admin/member/MemberModifyCompoenet"));
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
              index: true,  // <- 기본 라우트
              element: <Suspense fallback={<Loading />}><ProductListComponent /></Suspense>
            },
            {
              path: "add",
              element :(
                <Suspense fallback={<Loading />}><ProductFormComponent /></Suspense>
              )
            },
            {
              path: "modify/:id",
              element: (
                <Suspense fallback={<Loading />}><ProductFormComponent /></Suspense>
              )
            }
          ]
        },
        {
          path: "member",
          element : (
            <Suspense fallback={<Loading />}><MemberCompenet /></Suspense>
          ),
          children:[
            {
              index : true,
              element : (
                <Suspense fallback={<Loading />}><MemberListCompenet /></Suspense>
              )
            },
            {
              path : "modify/:id",
              element : (
                <Suspense fallback={<Loading />}><MemberModifyCompoenet /></Suspense>
              )
            },
          ]
        },
        {
          path: "category",
          element: (
            <Suspense fallback={<Loading />}><CategoryCompoenet /></Suspense>
          ),
        },
        {
          path: "user",
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
