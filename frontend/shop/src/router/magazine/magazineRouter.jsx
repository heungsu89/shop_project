import React, { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const MagazinePage = lazy(() => import("../../Pages/magazine/MagazinePage"));
const MagazineDetail = lazy(() => import("../../Pages/magazine/MagazineDetail"));

const magazineRouter = () => [
  {
    path: "/magazine",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading/>}><MagazinePage/> </Suspense>
        ),
      },
      {
        path: "/magazine/detail", 
        element: (
          <Suspense fallback={<Loading/>}> <MagazineDetail/></Suspense>
        ),
      },
    ],
  },
];

export default magazineRouter;