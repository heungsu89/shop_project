import { Suspense, lazy } from "react";
const Loading = () => <div>Loading....</div>;

const UserMainPage = lazy(() => import("../../Pages/myPage/user/UserMainPage"));
const OrderComponent = lazy(() => import("../../Components/mypage/user/order/OrderComponent"));
const InquiryComponent = lazy(() => import("../../Components/mypage/user/inquiry/InquiryComponent"));
const MileageComponent = lazy(() => import("../../Components/mypage/user/mileage/MileageComponent"));
const WishCompoent = lazy(() => import("../../Components/mypage/user/wish/WishCompoent"));
const ProfileComponent = lazy(() => import("../../Components/mypage/user/profile/ProfileComponent"));


const uesrRouter = () => {
    return [
        {
            path: "mypage",
            element: (
                <Suspense fallback={<Loading />}><UserMainPage /></Suspense>
            ),
            children: [
                {
                    path: "order",
                    element: (
                        <Suspense fallback={<Loading />}><OrderComponent /></Suspense>
                    ),
                },
                {
                    path: "inquiry",
                    element: (
                        <Suspense fallback={<Loading />}><InquiryComponent /></Suspense>
                    ),
                },
                {
                    path: "mileage",
                    element: (
                        <Suspense fallback={<Loading />}><MileageComponent /></Suspense>
                    ),
                },
                {
                    path: "wish",
                    element: (
                        <Suspense fallback={<Loading />}><WishCompoent /></Suspense>
                    ),
                },
                {
                    path: "profile",
                    element: (
                        <Suspense fallback={<Loading />}><ProfileComponent /></Suspense>
                    ),
                },
            ]
        }
    ];
};

export default uesrRouter;