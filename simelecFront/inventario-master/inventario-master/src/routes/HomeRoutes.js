import { PATH_HOME } from "./paths";
import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import AuthProtect from 'src/components/Auth/AuthProtect';
import DashboardLayoutHome from 'src/layouts/DashboardLayoutHome';

// ----------------------------------------------------------------------

const HomeRoutes = {
  path: PATH_HOME.root,
  guard: AuthProtect,
  layout: DashboardLayoutHome,
  routes: [
    {
      exact: true,
      path: PATH_HOME.root,
      component: lazy(() => import("src/views/home/WelcomeViews")),
    },
    {
      exact: true,
      path: PATH_HOME.sales,
      component: lazy(() => import("src/views/home/SaleListViews")),
    },
    {
      exact: true,
      path: PATH_HOME.sale,
      component: lazy(() => import("src/views/home/NewSaleViews")),
    },
    {
      exact: true,
      path: PATH_HOME.invoices,
      component: lazy(() => import("src/views/home/InvoiceListViews")),
    },
    {
      exact: true,
      path: PATH_HOME.invoice,
      component: lazy(() => import("src/views/home/NewInvoiceViews")),
    },
    {
      exact: true,
      path: PATH_HOME.invoiceview,
      component: lazy(() => import("src/views/home/InvoiceView")),
    },
    {
      exact: true,
      path: PATH_HOME.root,
      component: () => <Redirect to={PATH_HOME.root} />,
    }
  ],
};

export default HomeRoutes;
