import { Route } from 'react-router-dom';
import Fleet from '../../pages/admin/operations/Fleet';
import OrderManagement from '../../pages/admin/operations/OrderManagement';
import Search from '../../pages/admin/operations/Search';
import Track from '../../pages/admin/operations/Track';
import TruckDetail from '../../pages/admin/operations/TruckDetail';
import Waybills from '../../pages/admin/operations/Waybills';

/**
 * OWNERSHIP: admin-operations agent. You may freely edit this file and
 * anything under `web/src/pages/admin/operations/` — no other group touches
 * these paths.
 *
 * EXPORT PATTERN (same in every `web/src/routes/admin/*.routes.tsx` file):
 * a plain array of React Router `<Route>` elements (`operationsRoutes`),
 * with `path` values RELATIVE to `/admin` (spread as children of the
 * `<AdminLayout>` route in `web/src/routes/admin.routes.tsx` — e.g.
 * `path="fleet"` resolves to `/admin/fleet`).
 *
 * TO ADD/FINISH A SCREEN: swap the placeholder component in the matching
 * `web/src/pages/admin/operations/*.tsx` file for real content (keep the
 * same default export). Do NOT change `path` values here, add/remove array
 * items, or touch `admin.routes.tsx` — the route paths below are final and
 * already wired into the sidebar nav in `Layout.tsx`.
 */
export const operationsRoutes = [
  <Route key="ops-order-management" path="order-management" element={<OrderManagement />} />,
  <Route key="ops-track" path="track" element={<Track />} />,
  <Route key="ops-fleet" path="fleet" element={<Fleet />} />,
  <Route key="ops-search" path="search" element={<Search />} />,
  <Route key="ops-truck-detail" path="truck-detail/:id" element={<TruckDetail />} />,
  <Route key="ops-waybills" path="waybills" element={<Waybills />} />,
];
