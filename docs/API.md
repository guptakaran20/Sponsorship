# SponsorGrid API Documentation

Base URL: `http://localhost:5000/api`

All authenticated requests require `Authorization: Bearer <access_token>` header.

---

## Authentication

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "CLUB",
  "adminSecret": "optional-for-admin-role"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "CLUB" },
    "token": "<access_token>"
  }
}
```

---

### POST /auth/login
Login with credentials.

**Request Body:**
```json
{ "email": "user@example.com", "password": "securepassword" }
```

**Response 200:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "CLUB" },
    "token": "<access_token>"
  }
}
```
Sets `refreshToken` HttpOnly cookie.

---

### POST /auth/refresh
Refresh access token using HttpOnly cookie.

**Response 200:**
```json
{ "success": true, "message": "Token refreshed", "data": { "token": "<new_access_token>" } }
```

---

### POST /auth/logout
Clear refresh token cookie.

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

### GET /auth/me
Get current authenticated user.

**Auth:** Required

**Response 200:**
```json
{
  "success": true,
  "message": "User fetched",
  "data": { "id": "...", "email": "...", "name": "...", "role": "CLUB", "isVerified": false }
}
```

---

## Events

### GET /events
List events for authenticated user (club sees own events, companies see all).

**Auth:** Required

### POST /events
Create an event (Club only).

**Auth:** Required | **Role:** CLUB

**Request Body:**
```json
{
  "name": "Tech Fest 2025",
  "description": "Annual technology festival",
  "eventType": "Tech",
  "footfall": 500,
  "location": "Mumbai",
  "date": "2025-12-15T10:00:00.000Z"
}
```

### GET /events/:id
Get a specific event.

**Auth:** Required

### PUT /events/:id
Update an event (Club only, own events).

**Auth:** Required | **Role:** CLUB

### DELETE /events/:id
Delete an event.

**Auth:** Required | **Role:** CLUB

---

## Deals

### GET /deals
Get deals for the authenticated user.

**Auth:** Required | **Role:** CLUB or COMPANY

### POST /deals
Create a sponsorship deal request.

**Auth:** Required | **Role:** COMPANY

**Request Body:**
```json
{ "eventId": "<uuid>", "tierId": "<uuid>" }
```

### PUT /deals/:id/status
Update deal status.

**Auth:** Required | **Role:** CLUB

**Request Body:**
```json
{ "status": "ACCEPTED" }
```

Valid statuses: `PENDING`, `NEGOTIATING`, `ACCEPTED`, `REJECTED`

### POST /deals/:id/verify-pin
Verify deal PIN to complete a deal.

**Auth:** Required | **Role:** CLUB

**Request Body:**
```json
{ "pin": "ABC123" }
```

---

## Clubs

### GET /clubs/profile
Get authenticated club profile.

**Auth:** Required | **Role:** CLUB

### PUT /clubs/profile
Update club profile.

**Auth:** Required | **Role:** CLUB

---

## Companies

### GET /companies/profile
Get authenticated company profile.

**Auth:** Required | **Role:** COMPANY

### PUT /companies/profile
Update company profile.

**Auth:** Required | **Role:** COMPANY

---

## Notifications

### GET /notifications
Get notifications for current user.

**Auth:** Required

### PUT /notifications/:id/read
Mark notification as read.

**Auth:** Required

---

## Public

### GET /public/events
List all upcoming public events. No auth required.

### GET /public/leaderboard
Get top clubs and companies. No auth required.

---

## Health

### GET /health
Check API health.

**Response 200:**
```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z", "uptime": 123.45 }
```

---

## Error Responses

All errors follow this format:
```json
{ "success": false, "message": "Error description" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
