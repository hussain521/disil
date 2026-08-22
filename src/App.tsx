import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import ScrollToTop from './components/ScrollToTop';
import RouteLoadingFallback from './components/RouteLoadingFallback';
import { adminRoutes } from './routes/admin.routes';
import { companyRoutes } from './routes/company.routes';
import { marketingRoutes } from './routes/marketing.routes';

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {marketingRoutes}
          {companyRoutes}
          {adminRoutes}
        </Routes>
      </Suspense>
      <ScrollToTop />
    </ThemeProvider>
  );
}
