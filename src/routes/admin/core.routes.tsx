import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Dashboard = lazy(() => import('../../pages/admin/core/Dashboard'));
const NewOffers = lazy(() => import('../../pages/admin/core/NewOffers'));
const OrderDetail = lazy(() => import('../../pages/admin/core/OrderDetail'));
const Orders = lazy(() => import('../../pages/admin/core/Orders'));
const Profile = lazy(() => import('../../pages/admin/core/Profile'));
const UserDetail = lazy(() => import('../../pages/admin/core/UserDetail'));
const Users = lazy(() => import('../../pages/admin/core/Users'));

/**
 * OWNERSHIP: admin-core agent. You may freely edit this file and anything
 * under `web/src/pages/admin/core/` — no other group touches these paths.
 *
 * EXPORT PATTERN (same in every `web/src/routes/admin/*.routes.tsx` file):
 * a plain array of React Router `<Route>` elements (`coreRoutes`), with
 * `path` values RELATIVE to `/admin` (this array is spread as children of
 * the `<AdminLayout>` route in `web/src/routes/admin.routes.tsx` — e.g.
 * `path="orders"` resolves to `/admin/orders`). The dashboard route uses
 * `index` instead of `path` since it's `/admin` itself.
 *
 * TO ADD/FINISH A SCREEN: swap the placeholder component in the matching
 * `web/src/pages/admin/core/*.tsx` file for real content (keep the same
 * default export). Do NOT change `path`/`index` values here, add/remove
 * array items, or touch `admin.routes.tsx` — the route paths below are
 * final and already wired into the sidebar nav in `Layout.tsx`.
 */
export const coreRoutes = [
  <Route key="core-dashboard" index element={<Dashboard />} />,
  <Route key="core-new-offers" path="new-offers" element={<NewOffers />} />,
  <Route key="core-orders" path="orders" element={<Orders />} />,
  <Route key="core-order-detail" path="orders/:id" element={<OrderDetail />} />,
  <Route key="core-users" path="users" element={<Users />} />,
  <Route key="core-user-detail" path="users/:id" element={<UserDetail />} />,
  <Route key="core-profile" path="profile" element={<Profile />} />,
];
