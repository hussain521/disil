import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Admins = lazy(() => import('../../pages/admin/misc/Admins'));
const Audit = lazy(() => import('../../pages/admin/misc/Audit'));
const ContractNew = lazy(() => import('../../pages/admin/misc/ContractNew'));
const Contracts = lazy(() => import('../../pages/admin/misc/Contracts'));
const Notifications = lazy(() => import('../../pages/admin/misc/Notifications'));
const VehicleTypes = lazy(() => import('../../pages/admin/misc/VehicleTypes'));

/**
 * OWNERSHIP: admin-misc agent. You may freely edit this file and anything
 * under `web/src/pages/admin/misc/` — no other group touches these paths.
 *
 * EXPORT PATTERN (same in every `web/src/routes/admin/*.routes.tsx` file):
 * a plain array of React Router `<Route>` elements (`miscRoutes`), with
 * `path` values RELATIVE to `/admin` (spread as children of the
 * `<AdminLayout>` route in `web/src/routes/admin.routes.tsx` — e.g.
 * `path="admins"` resolves to `/admin/admins`).
 *
 * TO ADD/FINISH A SCREEN: swap the placeholder component in the matching
 * `web/src/pages/admin/misc/*.tsx` file for real content (keep the same
 * default export). Do NOT change `path` values here, add/remove array
 * items, or touch `admin.routes.tsx` — the route paths below are final and
 * already wired into the sidebar nav in `Layout.tsx`.
 */
export const miscRoutes = [
  <Route key="misc-admins" path="admins" element={<Admins />} />,
  <Route key="misc-audit" path="audit" element={<Audit />} />,
  <Route key="misc-contracts" path="contracts" element={<Contracts />} />,
  <Route key="misc-contract-new" path="contracts/new" element={<ContractNew />} />,
  <Route key="misc-vehicle-types" path="vehicle-types" element={<VehicleTypes />} />,
  <Route key="misc-notifications" path="notifications" element={<Notifications />} />,
];
