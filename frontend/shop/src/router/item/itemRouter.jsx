import { createBrowserRouter, RouterProvider, Suspense, lazy } from "react";

const ItemListPage = lazy(() => import("./pages/ItemListPage"));
const ItemDetailPage = lazy(() => import("./pages/ItemDetailPage"));

const Loading = <div>Loading....</div>;

const itemRouter = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={Loading}><ItemListPage /></Suspense>,
  },
  {
    path: "/items/:itemId",
    element: <Suspense fallback={Loading}><ItemDetailPage /></Suspense>,
  },
]);

const ItemRouter = () => {
  return <RouterProvider router={itemRouter} />;
};

export default ItemRouter;
