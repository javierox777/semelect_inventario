import { PATH_ADMIN } from "./paths";
import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import AdminProtected from "src/components/Auth/AdminProtect";
import DashboardLayout from "src/layouts/DashboardLayoutAdmin";

// ----------------------------------------------------------------------

const AdminRoutes = {
  path: PATH_ADMIN.root,
  guard: AdminProtected,
  layout: DashboardLayout,
  routes: [
    {
      exact: true,
      path: PATH_ADMIN.root,
      component: lazy(() => import("src/views/admin/WelcomeViews")),
    },
    {
      exact: true,
      path: PATH_ADMIN.sellers,
      component: lazy(() => import("src/views/admin/SellerListViews")),
    },
    {
      exact: true,
      path: PATH_ADMIN.products,
      component: lazy(() => import("src/views/admin/ProductListViews")),
    },
    {
      exact: true,
      path: PATH_ADMIN.clients,
      component: lazy(() => import("src/views/admin/ClientListViews")),
    },
    {
      exact: true,
      path: PATH_ADMIN.sales,
      component: lazy(() => import("src/views/admin/SaleListViews")),
    },
    {
      exact: true,
      path: PATH_ADMIN.root,
      component: () => <Redirect to={PATH_ADMIN.root} />,
    }
  ],
};

export default AdminRoutes;
