import { lazy } from 'react';
import { Outlet, Route } from 'react-router-dom';
import { AdminAuthProvider } from '../lib/auth';
import { AdminThemeProvider } from '../lib/adminTheme';
import { accountsRoutes } from './admin/accounts.routes';
import { coreRoutes } from './admin/core.routes';
import { miscRoutes } from './admin/misc.routes';
import { operationsRoutes } from './admin/operations.routes';
import { reviewRoutes } from './admin/review.routes';

const AdminLayout = lazy(() => import('../pages/admin/Layout'));
const AdminLogin = lazy(() => import('../pages/admin/Login'));

/**
 * Admin portal route tree — mounted at `/admin/*`, wrapped in its own
 * `AdminAuthProvider` so its session is isolated from the company portal.
 *
 * `/admin/login` is public. Every other `/admin/*` path is nested under
 * `<AdminLayout>`, which itself acts as the route guard — it redirects to
 * `/admin/login` when there's no active session, and otherwise renders the
 * sidebar/topbar shell around an `<Outlet>`.
 *
 * The 28 admin screens are split across 5 independently-owned route files
 * under `web/src/routes/admin/` (`core`, `operations`, `review`, `accounts`,
 * `misc`), each exporting a flat array of `<Route>` elements with paths
 * relative to `/admin`. Adding/finishing a screen never requires touching
 * this file — see the header comment in each `*.routes.tsx` file.
 */
export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <AdminAuthProvider>
        <AdminThemeProvider>
          <Outlet />
        </AdminThemeProvider>
      </AdminAuthProvider>
    }
  >
    <Route path="login" element={<AdminLogin />} />
    <Route element={<AdminLayout />}>
      {coreRoutes}
      {operationsRoutes}
      {reviewRoutes}
      {accountsRoutes}
      {miscRoutes}
    </Route>
  </Route>
);
