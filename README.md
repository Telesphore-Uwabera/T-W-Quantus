# T&W Quantus Website

Official website for T&W QUANTUS LTD, a Kigali-based construction, quantity surveying, cost management, project management, construction management, and technical services firm.

## Environment

- **Backend (Express, MongoDB, Cloudinary, admin):** `server/.env.development` — copy from `server/.env.development.example`.
- **Frontend (Vite, `VITE_*` only):** `client/.env.development` — copy from `client/.env.development.example`.
- Production: `server/.env.production` and `client/.env.production` (or host dashboards: Render / Netlify).

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
