import { Navigate, Outlet, Route } from 'react-router-dom';
import { CompanyAuthProvider, useCompanyAuth } from '../lib/auth';
import CompanyLogin from '../pages/company/Login';
import FleetTrack from '../pages/company/FleetTrack';
import TripDetail from '../pages/company/TripDetail';

/** Auth check bypassed temporarily for company portal. */
function RequireCompanyAuth() {
  return <Outlet />;
}

/**
 * Company (client) portal route tree — mounted at `/company/*`, wrapped in
 * its own `CompanyAuthProvider` so its session is isolated from the admin
 * portal. This is a dedicated, self-contained map-only portal: no links out
 * to admin or marketing routes.
 */
export const companyRoutes = (
  <Route
    path="/company"
    element={
      <CompanyAuthProvider>
        <Outlet />
      </CompanyAuthProvider>
    }
  >
    <Route index element={<Navigate to="/company/track" replace />} />
    <Route path="login" element={<CompanyLogin />} />
    <Route element={<RequireCompanyAuth />}>
      <Route path="track" element={<FleetTrack />} />
      <Route path="track/:orderId" element={<TripDetail />} />
    </Route>
    <Route path="*" element={<Navigate to="/company/track" replace />} />
  </Route>
);
