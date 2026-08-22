import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Landing = lazy(() => import('../pages/marketing/Landing'));
const Terms = lazy(() => import('../pages/marketing/Terms'));
const PricingPolicy = lazy(() => import('../pages/marketing/PricingPolicy'));
const PrivacyPolicy = lazy(() => import('../pages/marketing/PrivacyPolicy'));
const ContactAndTeam = lazy(() => import('../pages/marketing/ContactAndTeam'));
const TrackShipment = lazy(() => import('../pages/marketing/TrackShipment'));

/** Public marketing site route tree — mounted at `/`. No auth required. */
export const marketingRoutes = (
  <>
    <Route path="/" element={<Landing />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/pricing-policy" element={<PricingPolicy />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/contact-team" element={<ContactAndTeam />} />
    <Route path="/track" element={<TrackShipment />} />
  </>
);
