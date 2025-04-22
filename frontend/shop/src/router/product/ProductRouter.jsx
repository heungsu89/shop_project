import { Suspense, lazy } from "react";

const Loading = () => <div>Loading....</div>;

const ProductPage = lazy(() => import("../../Pages/product/ProductPage"));
const ProductListComponent = lazy(() => import("../../Components/product/ProductListComponent"));
const ProductDetailComponent = lazy(() => import("../../Components/product/ProductDetailComponent"));

const ProductRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={<Loading />}><ProductPage /></Suspense>
      ),
      children: [
        {
          path: "list/:categoryId",
          element: (
            <Suspense fallback={<Loading />}><ProductListComponent /></Suspense>
          )
        },
        {
          path: "detail/:itemId",
          element: (
            <Suspense fallback={<Loading />}><ProductDetailComponent /></Suspense>
          )
        }
      ]
    }
  ];
};

export default ProductRouter;
