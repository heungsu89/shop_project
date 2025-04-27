import React, { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const MagazinePage = lazy(() => import("../../Pages/magazine/MagazinePage"));
const MagazineDetailPage = lazy(() => import("../../Pages/magazine/MagazineDetail"));
const MagazineListComponent = lazy(() => import("../../Components/magazine/MagazineListComponent"));
const MagazineDetailComponent = lazy(() => import("../../Components/magazine/MagazineDetailComponent"));

const magazineRouter = () => [
  {
    path: "list", // 📌 부모
    element: (
      <Suspense fallback={<Loading />}><MagazinePage /></Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}><MagazineListComponent /></Suspense>
        )
      }
    ]
  },
  {
    path: "detail/:id", // 📌 부모
    element: (
      <Suspense fallback={<Loading />}><MagazineDetailPage /></Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}><MagazineDetailComponent /></Suspense>
        )
      }
    ]
  },
];

export default magazineRouter;
