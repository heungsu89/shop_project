<<<<<<< HEAD
import React, { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const MagazinePage = lazy(() => import("../../Pages/magazine/MagazinePage"));
const MagazineDetailPage = lazy(() => import("../../Pages/magazine/MagazineDetailPage"));
const MagazineListComponent = lazy(() => import("../../Components/magazine/MagazineListComponent"));
const MagazineDetailComponent = lazy(() => import("../../Components/magazine/MagazineDetailComponent"));

const magazineRouter = () => [
  {
    path: "list",
    element: (
      <Suspense fallback={<Loading />}><MagazinePage /></Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <MagazineListComponent />
        )
      }
    ]
  },
  {
    path: "detail/:id",
    element: (
      <Suspense fallback={<Loading />}><MagazineDetailPage /></Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <MagazineDetailComponent />
        )
      }
    ]
  },
];

export default magazineRouter;
=======
import React, { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const MagazinePage = lazy(() => import("../../Pages/magazine/MagazinePage"));
const MagazineDetailPage = lazy(() => import("../../Pages/magazine/MagazineDetailPage"));
const MagazineListComponent = lazy(() => import("../../Components/magazine/MagazineListComponent"));
const MagazineDetailComponent = lazy(() => import("../../Components/magazine/MagazineDetailComponent"));

const magazineRouter = () => [
  {
    path: "list",
    element: (
      <Suspense fallback={<Loading />}><MagazinePage /></Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <MagazineListComponent />
        )
      }
    ]
  },
  {
    path: "detail/:id",
    element: (
      <Suspense fallback={<Loading />}><MagazineDetailPage /></Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <MagazineDetailComponent />
        )
      }
    ]
  },
];

export default magazineRouter;
>>>>>>> 6c80c21440fd34d348db1950f2af8e1e895ca51a
