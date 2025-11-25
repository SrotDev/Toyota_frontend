# Track n Race

Track n Race is a lightweight frontend aligned to the Django backend architecture described for tracks, laps, sectors, telemetry points, ideal behaviors, and upload flows. The app keeps only the components required to browse tracks, review lap and sector summaries, view ideal telemetry, compare uploads, and preview leaderboard outputs.

## Run locally

Backend (Django) should be running on `http://127.0.0.1:8000`.

1. Install dependencies
   ```bash
   npm install
   ```
2. (Optional) create `.env.local` overriding API base if not using proxy
   ```bash
   cp .env.local.example .env.local
   # edit VITE_API_BASE as needed
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```

Vite proxy (configured in `vite.config.ts`) forwards `/api/*` to the Django backend so most setups do not need `VITE_API_BASE`.

## Feature map
- **Tracks**: list, detail map, lap table, sector radar, and telemetry navigation.
- **Telemetry**: ideal curves, user vs ideal overlay, turn-level views, heatmap placeholders, and racing line overlays.
- **Uploads**: ingest telemetry files, view async status/result, and persist the last session locally.
- **Predictions**: real-time endpoints (`/api/predict/*`) and stored artifact fetchers (`/api/predictions/<track>/*`) wired in `services/endpoints/predictions.ts`.

Mock data mirrors the REST endpoints and falls back whenever network calls fail, enabling offline UI development.

## Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE` | Override base API URL (bypasses proxy) | `/api` |

If unset, the app relies on the Vite dev proxy. When set (e.g. to `https://staging.example.com/api`), requests go directly to that host.

## Backend endpoint alignment

Implemented Django endpoints consumed by this frontend:

- Track laps: `GET /api/tracks/<uuid>/laps/`
- Track sectors: `GET /api/tracks/<uuid>/sectors/`
- Ideal telemetry (track): `GET /api/tracks/<uuid>/telemetry/ideal/`
- Ideal telemetry (turn): `GET /api/tracks/<uuid>/telemetry/ideal/<turn>/`
- Telemetry compare: `GET /api/tracks/<uuid>/telemetry/compare/`
- Ideal behaviors: `GET /api/tracks/<uuid>/telemetry/ideal/behaviors/`
- Lap time prediction: `POST /api/predict/lap-time/`
- Sector time prediction: `POST /api/predict/sector-time/`
- Behavior prediction: `POST /api/predict/telemetry-behavior/`
- Simulate lap: `POST /api/simulate-lap/`
- Stored lap predictions: `GET /api/predictions/<track>/lap/`
- Stored sector predictions: `GET /api/predictions/<track>/sector/`
- Stored behavior predictions: `GET /api/predictions/<track>/behavior/`
- Stored ideal racing line: `GET /api/predictions/<track>/ideal-line/`
- Stored turn recommendations: `GET /api/predictions/<track>/turn-recommendations/`

All new backend endpoints have synthetic or real data sources allowing the frontend to function without modifying existing component logic.