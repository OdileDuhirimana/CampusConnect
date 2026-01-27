CampusConnect API Testing Guide

This document lists all available backend APIs and provides example requests and sample data you can use to test them.

Base URL (default when running Django dev server):
- http://127.0.0.1:8000/
- All API endpoints are under the /api/ prefix (except /admin/).

Authentication
- JWT Access tokens are required for endpoints that need authentication.
- Obtain tokens via the auth endpoints below, then pass the token in the Authorization header as: Authorization: Bearer <ACCESS_TOKEN>

Pre-requisites
- Start the server from the backend directory:
  - python manage.py runserver

Notes
- Replace <ACCESS_TOKEN>, <POST_ID>, <EVENT_ID>, <ROOM_ID>, <MESSAGE_ID> with real IDs from your environment.
- For file upload (Post media), use multipart/form-data.


1) Users/Auth APIs

1. Register
- Method/Path: POST /api/auth/register/
- Sample body (JSON):
  {
    "username": "alice",
    "email": "alice@example.com",
    "password": "secret123"
  }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/auth/register/ \
       -H "Content-Type: application/json" \
       -d '{"username":"alice","email":"alice@example.com","password":"secret123"}'

2. Login (Obtain JWT)
- Method/Path: POST /api/auth/login/
- Sample body (JSON):
  {
    "username": "alice",
    "password": "secret123"
  }
- Response includes access and refresh.
- cURL:
  curl -X POST http://127.0.0.1:8000/api/auth/login/ \
       -H "Content-Type: application/json" \
       -d '{"username":"alice","password":"secret123"}'

3. Refresh Token
- Method/Path: POST /api/auth/refresh/
- Sample body (JSON):
  {
    "refresh": "<REFRESH_TOKEN>"
  }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/auth/refresh/ \
       -H "Content-Type: application/json" \
       -d '{"refresh":"<REFRESH_TOKEN>"}'

4. Current User (Me)
- Method/Path: GET /api/auth/me/
- Auth: Bearer <ACCESS_TOKEN>
- cURL:
  curl http://127.0.0.1:8000/api/auth/me/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"


2) Posts APIs
Resource base: /api/posts/

Serializer fields
- Post: id, user (string), content (text), media (url), created_at, comments (list), likes_count (int)

1. List Posts
- GET /api/posts/
- cURL:
  curl http://127.0.0.1:8000/api/posts/

2. Retrieve Post
- GET /api/posts/<POST_ID>/
- cURL:
  curl http://127.0.0.1:8000/api/posts/1/

3. Create Post (text only)
- POST /api/posts/
- Auth required
- Body (JSON):
  {
    "content": "Hello Campus!"
  }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/posts/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content":"Hello Campus!"}'

4. Create Post with Image
- POST /api/posts/
- Auth required, multipart/form-data
- cURL example (replace path/to/image.jpg):
  curl -X POST http://127.0.0.1:8000/api/posts/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -F "content=Photo from the quad" \
       -F "media=@path/to/image.jpg"

5. Update Post (replace)
- PUT /api/posts/<POST_ID>/
- Auth required (owner only)
- Body (JSON): { "content": "Updated text" }
- cURL:
  curl -X PUT http://127.0.0.1:8000/api/posts/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content":"Updated text"}'

6. Partial Update Post
- PATCH /api/posts/<POST_ID>/
- Auth required (owner only)
- Body (JSON): { "content": "Partially updated" }
- cURL:
  curl -X PATCH http://127.0.0.1:8000/api/posts/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content":"Partially updated"}'

7. Delete Post
- DELETE /api/posts/<POST_ID>/
- Auth required (owner only)
- cURL:
  curl -X DELETE http://127.0.0.1:8000/api/posts/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

8. Comment on Post
- POST /api/posts/<POST_ID>/comment/
- Auth required
- Body (JSON): { "content": "Nice post!" }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/posts/1/comment/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content":"Nice post!"}'

9. Like Post
- POST /api/posts/<POST_ID>/like/
- Auth required
- cURL:
  curl -X POST http://127.0.0.1:8000/api/posts/1/like/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

10. Unlike Post
- POST /api/posts/<POST_ID>/unlike/
- Auth required
- cURL:
  curl -X POST http://127.0.0.1:8000/api/posts/1/unlike/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"


3) Events APIs
Resource base: /api/events/

Serializer fields
- Event: id, title, description, start_time, end_time, location, created_by, created_at
- RSVP action (EventParticipant): id, event, user, rsvp_status, joined_at

Sample event timestamps are ISO 8601 (UTC example): 2025-01-23T10:00:00Z

1. List Events
- GET /api/events/
- cURL:
  curl http://127.0.0.1:8000/api/events/

2. Retrieve Event
- GET /api/events/<EVENT_ID>/
- cURL:
  curl http://127.0.0.1:8000/api/events/1/

3. Create Event
- POST /api/events/
- Auth required
- Body (JSON):
  {
    "title": "Hackathon",
    "description": "24h coding marathon",
    "start_time": "2025-11-20T09:00:00Z",
    "end_time": "2025-11-20T17:00:00Z",
    "location": "Main Hall"
  }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/events/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"title":"Hackathon","description":"24h coding marathon","start_time":"2025-11-20T09:00:00Z","end_time":"2025-11-20T17:00:00Z","location":"Main Hall"}'

4. Update Event
- PUT /api/events/<EVENT_ID>/
- Auth required (owner only)
- Body (JSON): { "title": "Updated Hackathon", ... }
- cURL:
  curl -X PUT http://127.0.0.1:8000/api/events/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"title":"Updated Hackathon","description":"New details","start_time":"2025-11-20T10:00:00Z","end_time":"2025-11-20T18:00:00Z","location":"Auditorium"}'

5. Partial Update Event
- PATCH /api/events/<EVENT_ID>/
- Auth required (owner only)
- Body (JSON): { "location": "Room 101" }
- cURL:
  curl -X PATCH http://127.0.0.1:8000/api/events/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"location":"Room 101"}'

6. Delete Event
- DELETE /api/events/<EVENT_ID>/
- Auth required (owner only)
- cURL:
  curl -X DELETE http://127.0.0.1:8000/api/events/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

7. RSVP to Event
- POST /api/events/<EVENT_ID>/rsvp/
- Auth required
- Body (JSON): { "status": "yes" }  // allowed: yes | no | maybe
- cURL:
  curl -X POST http://127.0.0.1:8000/api/events/1/rsvp/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"status":"yes"}'


4) Chat APIs
Resources: /api/rooms/ and /api/messages/

Serializer fields
- Room: id, name, is_group, created_at, members
- Message: id, room, sender, content, created_at, read_by

Rooms
1. List Rooms
- GET /api/rooms/
- Auth required
- cURL:
  curl http://127.0.0.1:8000/api/rooms/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

2. Retrieve Room
- GET /api/rooms/<ROOM_ID>/
- Auth required
- cURL:
  curl http://127.0.0.1:8000/api/rooms/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

3. Create Room
- POST /api/rooms/
- Auth required
- Body (JSON): { "name": "CS Club", "is_group": true }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/rooms/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"name":"CS Club","is_group":true}'

4. Update Room
- PUT /api/rooms/<ROOM_ID>/
- Auth required
- Body (JSON): { "name": "CS Club (renamed)", "is_group": true }
- cURL:
  curl -X PUT http://127.0.0.1:8000/api/rooms/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"name":"CS Club (renamed)","is_group":true}'

5. Partial Update Room
- PATCH /api/rooms/<ROOM_ID>/
- Auth required
- Body (JSON): { "name": "CSC" }
- cURL:
  curl -X PATCH http://127.0.0.1:8000/api/rooms/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"name":"CSC"}'

6. Delete Room
- DELETE /api/rooms/<ROOM_ID>/
- Auth required
- cURL:
  curl -X DELETE http://127.0.0.1:8000/api/rooms/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

7. Join Room
- POST /api/rooms/<ROOM_ID>/join/
- Auth required
- cURL:
  curl -X POST http://127.0.0.1:8000/api/rooms/1/join/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

8. Leave Room
- POST /api/rooms/<ROOM_ID>/leave/
- Auth required
- cURL:
  curl -X POST http://127.0.0.1:8000/api/rooms/1/leave/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

Messages
1. List Messages (optionally filter by room)
- GET /api/messages/
- Query param: room=<ROOM_ID>
- Auth required
- cURL:
  curl "http://127.0.0.1:8000/api/messages/?room=1" \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

2. Retrieve Message
- GET /api/messages/<MESSAGE_ID>/
- Auth required
- cURL:
  curl http://127.0.0.1:8000/api/messages/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"

3. Create Message
- POST /api/messages/
- Auth required
- Body (JSON): { "room": 1, "content": "Hello everyone" }
- cURL:
  curl -X POST http://127.0.0.1:8000/api/messages/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"room":1,"content":"Hello everyone"}'

4. Update Message
- PUT /api/messages/<MESSAGE_ID>/
- Auth required
- Body (JSON): { "room": 1, "content": "Edited message" }
- cURL:
  curl -X PUT http://127.0.0.1:8000/api/messages/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"room":1,"content":"Edited message"}'

5. Partial Update Message
- PATCH /api/messages/<MESSAGE_ID>/
- Auth required
- Body (JSON): { "content": "Patched" }
- cURL:
  curl -X PATCH http://127.0.0.1:8000/api/messages/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content":"Patched"}'

6. Delete Message
- DELETE /api/messages/<MESSAGE_ID>/
- Auth required
- cURL:
  curl -X DELETE http://127.0.0.1:8000/api/messages/1/ \
       -H "Authorization: Bearer <ACCESS_TOKEN>"


5) Admin
- Django Admin: GET /admin/


6) Media
- Uploaded files served in DEBUG mode under /media/, e.g., /media/posts/<filename>


Quick Testing Flow
1) Register a user (or create multiple) and login to get an access token.
2) Create a post and optionally upload an image.
3) Comment and like/unlike the post.
4) Create an event and RSVP to it.
5) Create a room, join/leave, and send messages to the room; list messages filtered by room.
6) Use /api/auth/me/ to verify authenticated identity.


Troubleshooting
- Ensure Authorization header is present for protected endpoints.
- For datetime fields, use ISO 8601 strings with timezone suffix (e.g., Z for UTC).
- For image upload, ensure Pillow is installed and use multipart/form-data.