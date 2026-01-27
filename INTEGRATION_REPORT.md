# CampusConnect — Frontend/Backend Integration Report

This document records how to run the stack, how integration was verified, and what was fixed.

---

## Backend start instructions

### 1. Install dependencies

Use a virtual environment (recommended):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Database

- **Engine:** SQLite (default).
- **File:** `backend/db.sqlite3`.
- **Migrations:** Run once (and after pulling model changes):

```bash
python manage.py migrate
```

### 3. Environment variables

- None required for local dev. Optional: set `DJANGO_SETTINGS_MODULE` only if not using default (`core.settings`).

### 4. Media / static / CORS

- **Media:** Uploaded files (e.g. post images) go to `backend/media/`; served at `/media/` when `DEBUG=True` (see `core/urls.py`).
- **Static:** `STATIC_URL = 'static/'` (Django admin static files).
- **CORS:** `CORS_ALLOW_ALL_ORIGINS = True` in settings — frontend on any origin can call the API in dev.

### 5. Start the server

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

- Server runs at **http://127.0.0.1:8000/**.
- API base URL for the frontend: **http://127.0.0.1:8000/api** (no trailing slash in base; frontend appends paths with slashes, e.g. `/auth/login/`).

---

## Frontend start instructions

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Environment variables

- **`VITE_API_BASE`** (optional): Base URL of the API. If unset, frontend uses `http://localhost:8000/api`.
- To point at a different backend (e.g. different port or host):

  Create `frontend/.env` or `frontend/.env.local`:

  ```
  VITE_API_BASE=http://localhost:8000/api
  ```

  Or for a remote server:

  ```
  VITE_API_BASE=https://your-api.example.com/api
  ```

### 3. Start the dev server

```bash
cd frontend
npm run dev
```

- Vite dev server runs (typically **http://localhost:5173/**).
- Ensure the backend is running at the URL used by `VITE_API_BASE` (or default `http://localhost:8000/api`) so API and WebSocket calls succeed.

---

## Test user credentials

Create a user via the **Register** flow in the UI, or via API:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'
```

Then log in (UI or API):

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

Use the returned `access` token as `Authorization: Bearer <ACCESS_TOKEN>` for protected endpoints.

**Example test user (if you created one):**

- **Username:** testuser  
- **Password:** testpass123  
- **Email:** test@example.com  

(Replace with your own if you used different values.)

---

## List of working features (verified from code and config)

- **Auth**
  - Register (POST `/api/auth/register/`) — backend returns user; frontend redirects to login.
  - Login (POST `/api/auth/login/`) — backend returns `access` + `refresh`; frontend stores them and uses `access` in headers.
  - Token refresh (POST `/api/auth/refresh/`) — axios interceptor uses `refresh` and retries on 401.
  - Me (GET `/api/auth/me/`) — returns current user; Layout and Login call `fetchMe` when token exists.
  - Logout — frontend clears token/refresh and redirects to login.

- **Posts**
  - List (GET `/api/posts/`), create (POST `/api/posts/` with JSON or FormData for media), comment, like, unlike — request/response shapes match frontend slices and PostSerializer.

- **Events**
  - List (GET `/api/events/`), create (POST `/api/events/`), RSVP (POST `/api/events/<id>/rsvp/`) — match EventSerializer and frontend.

- **Chat**
  - List rooms (GET `/rooms/`), create room (POST `/rooms/`), join/leave (POST `/rooms/<id>/join/`, `/leave/`), list messages (GET `/messages/?room=<id>`), send message (POST `/messages/`) — match RoomSerializer, MessageSerializer and frontend.
  - WebSocket: frontend connects to `ws://<API_ORIGIN>/ws/chat/<room_id>/`; backend Channels consumer accepts and broadcasts. Sending via WebSocket does **not** persist messages (consumer only broadcasts); use REST POST `/messages/` for persistent messages.

- **Pages**
  - Feed, Events, Chat, Profile, Settings, Login, Register, NotFound — routes and Layout/RequireAuth are wired; data flow uses the above endpoints and slices.

---

## List of broken endpoints or flows (fixed)

1. **Auth URLs (fixed)**  
   - **Issue:** Backend had `auth/register`, `auth/login`, `auth/refresh`, `auth/me` **without** trailing slashes. Frontend and API_TESTING.md use trailing slashes (`/auth/register/`, etc.). Requests to `/api/auth/login/` did not match Django routes.  
   - **Fix:** Trailing slashes added in `backend/users/urls.py` so paths are `auth/register/`, `auth/login/`, `auth/refresh/`, `auth/me/`. Frontend and docs now match backend.

2. **ALLOWED_HOSTS (fixed)**  
   - **Issue:** `ALLOWED_HOSTS = []` could cause Django to reject requests when the frontend (or curl) calls the API by hostname.  
   - **Fix:** Set `ALLOWED_HOSTS = ['localhost', '127.0.0.1']` in `backend/core/settings.py` for local dev so the server accepts requests to `http://localhost:8000` and `http://127.0.0.1:8000`.

---

## Integration fixes applied (summary)

| File | Change |
|------|--------|
| `backend/users/urls.py` | Added trailing slashes to all four auth paths so they match frontend and API_TESTING.md. |
| `backend/core/settings.py` | Set `ALLOWED_HOSTS = ['localhost', '127.0.0.1']` for local development. |

No frontend code was changed. No new libraries were added.

---

## Endpoint checklist (request/response vs frontend)

| Area | Endpoint | Request format | Response format | Frontend usage |
|------|----------|----------------|------------------|----------------|
| Auth | POST /api/auth/register/ | JSON: username, email, password | 201 User (id, username, email) | authSlice register |
| Auth | POST /api/auth/login/ | JSON: username, password | access, refresh | authSlice login, stores token/refresh |
| Auth | POST /api/auth/refresh/ | JSON: refresh | access | api.ts interceptor |
| Auth | GET /api/auth/me/ | Bearer token | User (id, username, email) | authSlice fetchMe |
| Posts | GET /api/posts/ | — | List of Post | postsSlice fetchPosts |
| Posts | POST /api/posts/ | JSON or FormData (content, optional media) | Post | postsSlice createPost |
| Posts | POST /api/posts/:id/comment/ | JSON: content | Comment | postsSlice commentPost |
| Posts | POST /api/posts/:id/like/ | — | { liked: true } | postsSlice likePost |
| Posts | POST /api/posts/:id/unlike/ | — | { liked: false } | postsSlice unlikePost |
| Events | GET /api/events/ | — | List of Event | eventsSlice fetchEvents |
| Events | POST /api/events/ | JSON: title, description?, start_time, end_time, location? | Event | eventsSlice createEvent |
| Events | POST /api/events/:id/rsvp/ | JSON: status (yes/no/maybe) | EventParticipant | eventsSlice rsvpEvent |
| Chat | GET /api/rooms/ | Bearer | List of Room | chatSlice fetchRooms |
| Chat | POST /api/rooms/ | JSON: name, is_group? | Room | chatSlice createRoom |
| Chat | POST /api/rooms/:id/join/ | Bearer | Room | chatSlice joinRoom |
| Chat | POST /api/rooms/:id/leave/ | Bearer | Room | chatSlice leaveRoom |
| Chat | GET /api/messages/?room=:id | Bearer | List of Message | chatSlice fetchMessages |
| Chat | POST /api/messages/ | JSON: room, content | Message | chatSlice sendMessage |
| WS | ws://HOST/ws/chat/:id/ | JSON (e.g. { text }) | Broadcast in room | Chat.tsx refetches on message |

---

## Remaining backend features not yet implemented

- **Clubs:** App exists; no models, views, or URLs. No frontend.
- **Notifications:** App exists; no models, views, or URLs. Frontend uses client-only notifications (Redux notificationsSlice + NotificationBell).

---

## Quick verification steps (manual)

1. Start backend: `cd backend && .venv/bin/python manage.py runserver` (after venv + migrate).
2. Start frontend: `cd frontend && npm run dev`.
3. Open app in browser; register a user, then log in.
4. Check Feed (list/create post), Events (list/create/RSVP), Chat (rooms, join, send message via REST), Profile, Settings.
5. Optional: Test WebSocket by opening a room in Chat; send message via REST and confirm it appears; second tab in same room can use WS to see refetch after message.
