# DriftGR Frontend

Fresh React + Next.js + Tailwind implementation matching requested architecture.

## Development

Set backend API base (adjust port):

```bash
setx NEXT_PUBLIC_API_BASE http://127.0.0.1:8000/api
```

Install dependencies:

```bash
npm install
npm run dev
```

## Structure
```
src/app/
  layout.tsx          Global shell
  page.tsx            Home (tracks + leaderboard)
  tracks/page.tsx     Track list
  tracks/[id]/page.tsx Track overview (pit window, risk, next laps)
  ... (telemetry pages to be added)
utils/api.ts          API helper
```

## Next Steps
- Implement remaining telemetry pages (ideal, compare, heatmap, racing-line, turn specific).
- Add charts using Recharts/Chart.js components under `components/`.
- Integrate behavior compare POST endpoint with uploaded user curves.
- Add file upload flow under `/upload`.

Backend new endpoints under `/api/strategy/...` provide pit, risk, forecasting.
