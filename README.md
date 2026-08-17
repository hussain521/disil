# Diziel Web App

Vite + React + TypeScript web app for the Diziel platform: a public marketing
site, a company (client) live-tracking portal, and the full admin dashboard —
all talking to the same Node/Express + Socket.IO backend as the mobile app.

## Setup

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

## Environment

- `VITE_API_URL` — Diziel REST API base (e.g. `http://localhost:3000/api`).
- `VITE_SOCKET_URL` — Diziel Socket.IO base (defaults to `VITE_API_URL` minus `/api`).
- `VITE_GOOGLE_MAPS_API_KEY` — browser-restricted Google Maps JS API key (separate from mobile/backend keys).

## Structure

- `src/lib/` — shared infrastructure, framework-agnostic of any single screen:
  - `api/core.ts` — `request<T>()` fetch wrapper, `authHeaders()`, `API_URL`.
  - `api/auth.ts` — `login()`, `getMe()`, `AuthUser`/`AuthPayload` types.
  - `auth.tsx` — `CompanyAuthProvider`/`useCompanyAuth` and `AdminAuthProvider`/`useAdminAuth` (independent sessions, separate `localStorage` keys).
  - `socket.ts` — `useSocket(token)` Socket.IO wrapper (`joinTrip`/`leaveTrip`, reconnect re-join).
  - `googleMaps.ts` — `useGoogleMapsLoader()` wrapping `@react-google-maps/api`.
  - `polyline.ts` — Google encoded-polyline decoder.
- `src/components/` — shared, props-driven UI kit used across both portals: `DataTable`, `StatCard`/`StatCardGrid`, `FilterTabs`, `Modal`, `ImageZoomModal`, `Sidebar`, `Topbar`, `StatusBadge`, `Timeline`, `Pagination`.
- `src/routes/` — route composition per portal: `marketing.routes.tsx` (`/`), `company.routes.tsx` (`/company/*`, wrapped in `CompanyAuthProvider`), `admin.routes.tsx` (`/admin/*`, wrapped in `AdminAuthProvider`).
- `src/pages/` — screen components, grouped by portal (`marketing/`, `company/`, `admin/`).
- `src/App.tsx` — mounts all three route trees under a single `<Routes>`.

Styling uses Tailwind CSS with brand color tokens defined in `tailwind.config.js`:
`admin-*` (dark palette, mirrors `constants/role-theme.ts`) for the admin dashboard,
and `brand-*` (light palette, mirrors `constants/theme.ts` `Colors`) for the
marketing site and company portal.

This app is under active development — most pages are currently stubs.
