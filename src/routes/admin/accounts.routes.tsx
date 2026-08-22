import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Dashboards = lazy(() => import('../../pages/admin/accounts/Dashboards'));
const Financial = lazy(() => import('../../pages/admin/accounts/Financial'));
const PaymentDetails = lazy(() => import('../../pages/admin/accounts/PaymentDetails'));
const Pricing = lazy(() => import('../../pages/admin/accounts/Pricing'));
const Quotes = lazy(() => import('../../pages/admin/accounts/Quotes'));

/**
 * OWNERSHIP: admin-accounts agent. You may freely edit this file and
 * anything under `web/src/pages/admin/accounts/` — no other group touches
 * these paths.
 *
 * EXPORT PATTERN (same in every `web/src/routes/admin/*.routes.tsx` file):
 * a plain array of React Router `<Route>` elements (`accountsRoutes`), with
 * `path` values RELATIVE to `/admin` (spread as children of the
 * `<AdminLayout>` route in `web/src/routes/admin.routes.tsx` — e.g.
 * `path="financial"` resolves to `/admin/financial`).
 *
 * TO ADD/FINISH A SCREEN: swap the placeholder component in the matching
 * `web/src/pages/admin/accounts/*.tsx` file for real content (keep the same
 * default export). Do NOT change `path` values here, add/remove array
 * items, or touch `admin.routes.tsx` — the route paths below are final and
 * already wired into the sidebar nav in `Layout.tsx`.
 */
export const accountsRoutes = [
  <Route key="accounts-financial" path="financial" element={<Financial />} />,
  <Route key="accounts-dashboards" path="dashboards" element={<Dashboards />} />,
  <Route key="accounts-payment-details" path="payment-details" element={<PaymentDetails />} />,
  <Route key="accounts-pricing" path="pricing" element={<Pricing />} />,
  <Route key="accounts-quotes" path="quotes" element={<Quotes />} />,
];
