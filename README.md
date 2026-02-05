# CampusConnect

Campus social platform with:
- Django REST + Channels backend (`backend/`)
- React + Vite frontend (`frontend/`)

## Local Run

Backend:
1. `cd backend`
2. `python -m venv .venv && source .venv/bin/activate`
3. `pip install -r requirements.txt`
4. `cp .env.example .env` and update values
5. `python manage.py migrate`
6. `python manage.py runserver`

Frontend:
1. `cd frontend`
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev`

## Deployment

- Backend on Render: `render.yaml`
- Frontend on Vercel: `frontend/vercel.json`
- Environment variables and setup guide: `docs/deployment.md`
