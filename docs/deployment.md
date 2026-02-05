# Deployment Guide (Render + Vercel)

## Architecture

- Backend: Django + Channels (`backend/`) deployed on Render
- Frontend: Vite React SPA (`frontend/`) deployed on Vercel

## Backend on Render

Use `render.yaml` Blueprint.

Services created:
- `campusconnect-api` (web)
- `campusconnect-db` (PostgreSQL)

Set these env vars on `campusconnect-api`:
- `DJANGO_ALLOWED_HOSTS`: include Render hostname and custom domain
- `CORS_ALLOWED_ORIGINS`: your Vercel frontend URL(s)
- `CSRF_TRUSTED_ORIGINS`: same frontend URL(s) with `https://`
- `REDIS_URL` (optional): required only when scaling websocket workers

Auto-provisioned:
- `DATABASE_URL` from `campusconnect-db`
- `DJANGO_SECRET_KEY` from `generateValue: true`

## Frontend on Vercel

Deploy from `frontend/`.

Required env vars:
- `VITE_API_BASE`: Render backend API base, e.g. `https://campusconnect-api.onrender.com/api`

`frontend/vercel.json` already adds SPA rewrites to `index.html`.

## Where To Get Values

- `VITE_API_BASE`: copy from Render service public URL + `/api`
- `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`: from Vercel production URL
- `DJANGO_ALLOWED_HOSTS`: from Render host + custom domain hostnames
- `DATABASE_URL`: automatically injected by Render database linkage
