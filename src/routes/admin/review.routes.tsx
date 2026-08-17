import { Route } from 'react-router-dom';
import Approvals from '../../pages/admin/review/Approvals';
import Categories from '../../pages/admin/review/Categories';
import Complaints from '../../pages/admin/review/Complaints';
import Documents from '../../pages/admin/review/Documents';
import Ratings from '../../pages/admin/review/Ratings';

/**
 * OWNERSHIP: admin-review agent. You may freely edit this file and anything
 * under `web/src/pages/admin/review/` — no other group touches these paths.
 *
 * EXPORT PATTERN (same in every `web/src/routes/admin/*.routes.tsx` file):
 * a plain array of React Router `<Route>` elements (`reviewRoutes`), with
 * `path` values RELATIVE to `/admin` (spread as children of the
 * `<AdminLayout>` route in `web/src/routes/admin.routes.tsx` — e.g.
 * `path="documents"` resolves to `/admin/documents`).
 *
 * TO ADD/FINISH A SCREEN: swap the placeholder component in the matching
 * `web/src/pages/admin/review/*.tsx` file for real content (keep the same
 * default export). Do NOT change `path` values here, add/remove array
 * items, or touch `admin.routes.tsx` — the route paths below are final and
 * already wired into the sidebar nav in `Layout.tsx`.
 */
export const reviewRoutes = [
  <Route key="review-documents" path="documents" element={<Documents />} />,
  <Route key="review-approvals" path="approvals" element={<Approvals />} />,
  <Route key="review-complaints" path="complaints" element={<Complaints />} />,
  <Route key="review-ratings" path="ratings" element={<Ratings />} />,
  <Route key="review-categories" path="categories" element={<Categories />} />,
];
