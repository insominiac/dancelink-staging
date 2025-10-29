# Dance Platform API (Standalone)

A lightweight, separately deployable API service for the Dance Platform, built with Hono + TypeScript + Prisma.

## Endpoints (initial)
- GET /healthz — liveness probe
- GET /readyz — readiness (checks DB)
- GET /v1/admin/users — list users (example)

## Dev
```bash
# install deps (from repo root)
npm --prefix api install

# run dev server
npm --prefix api run dev

# open
curl http://localhost:4000/healthz
```

## Build & Run
```bash
npm --prefix api run build
npm --prefix api start
```

## Prisma
- Shares schema at ../prisma/schema.prisma
- Generate client for API:
```bash
npm --prefix api run prisma:generate
```
- Apply migrations in production:
```bash
npm --prefix api run prisma:migrate:deploy
```

## Env Vars
- PORT (default 4000)
- DATABASE_URL (Postgres connection)
- USE_LOCAL_DB=true + LOCAL_DATABASE_URL (optional override)
- CORS_ORIGIN (default *)

## Deploy
- Deploy `api/` to your infra (Railway/Fly/Render/Vercel serverless)
- Set DATABASE_URL and CORS_ORIGIN
- Expose port 4000 or use platform default

## Next steps
- Port remaining routes from /app/api to /v1
- Add auth (JWT/Session), rate limiting, logging, OpenAPI
