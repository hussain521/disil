import { Route } from 'react-router-dom';
import Landing from '../pages/marketing/Landing';
import PricingPolicy from '../pages/marketing/PricingPolicy';
import Terms from '../pages/marketing/Terms';
import PrivacyPolicy from '../pages/marketing/PrivacyPolicy';
import ContactAndTeam from '../pages/marketing/ContactAndTeam';
import TrackShipment from '../pages/marketing/TrackShipment';

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
