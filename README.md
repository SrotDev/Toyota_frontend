# Track n Race

Track n Race is a lightweight frontend aligned to the Django backend architecture described for tracks, laps, sectors, telemetry points, ideal behaviors, and upload flows. The app keeps only the components required to browse tracks, review lap and sector summaries, view ideal telemetry, compare uploads, and preview leaderboard outputs.

## Run locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm run dev
   ```

## Feature map
- **Tracks**: list, detail map, lap table, sector radar, and telemetry navigation.
- **Telemetry**: ideal curves, user vs ideal overlay, turn-level views, heatmap placeholders, and racing line overlays.
- **Uploads**: ingest telemetry files, view async status/result, and persist the last session locally.
- **Predictions**: client-side lap time prediction utility matching `/api/predict/lap-time/`.

Mock data mirrors the provided REST endpoints so pages can be wired to a future Django API without changing the UI structure.