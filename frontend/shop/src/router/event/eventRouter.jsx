import React, { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const EventPage = lazy(() => import("../../Pages/event/EventPage"));

const eventRouter = () => [
  {
    path: "/event",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading/>}><EventPage/> </Suspense>
        ),
      },
    ],
  },
];

export default eventRouter;