# SponsorBridge

> The two-sided marketplace connecting college clubs with companies for sponsorships.

[![CI](https://github.com/guptakaran20/Sponsorship/actions/workflows/ci.yml/badge.svg)](https://github.com/guptakaran20/Sponsorship/actions/workflows/ci.yml)

## Overview

SponsorBridge is a SaaS platform that eliminates cold-email based sponsorship outreach. College clubs list their events with sponsorship tiers, and companies discover and sponsor the audiences they care about.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Auth | JWT (Access + Refresh tokens) |
| Validation | Zod |
| Logging | Winston |
| Containerization | Docker + Docker Compose |

## Architecture

```
SponsorBridge/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/       # Environment validation
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── middlewares/  # Auth, validation, error handling, rate limiting
│   │   ├── routes/       # Route definitions
│   │   ├── validators/   # Zod schemas
│   │   ├── utils/        # JWT, ApiError, ApiResponse, logger
│   │   └── lib/          # Prisma client
│   └── prisma/           # Database schema
├── frontend/         # Next.js application
│   └── src/
│       ├── app/          # Next.js App Router pages
│       ├── components/   # Shared UI components
│       └── lib/          # API client utilities
├── nginx/            # Reverse proxy configuration
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

### Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values
```

### Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Running Locally

```bash
# Backend (terminal 1)
cd backend
npm install
npm run dev

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

### Running with Docker

```bash
# Copy and fill in required secrets
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build
```

## API Endpoints

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | /api/auth/register | No | - | Register user |
| POST | /api/auth/login | No | - | Login |
| POST | /api/auth/refresh | No | - | Refresh access token |
| POST | /api/auth/logout | No | - | Logout |
| GET | /api/auth/me | Yes | Any | Get current user |
| GET | /api/clubs/profile | Yes | CLUB | Get club profile |
| PUT | /api/clubs/profile | Yes | CLUB | Update club profile |
| GET | /api/events | Yes | Any | List events |
| POST | /api/events | Yes | CLUB | Create event |
| GET | /api/events/:id | Yes | Any | Get event |
| PUT | /api/events/:id | Yes | CLUB | Update event |
| DELETE | /api/events/:id | Yes | CLUB | Delete event |
| GET | /api/deals | Yes | CLUB/COMPANY | Get deals |
| POST | /api/deals | Yes | COMPANY | Create deal |
| PUT | /api/deals/:id/status | Yes | CLUB | Update deal status |
| POST | /api/deals/:id/verify-pin | Yes | CLUB | Verify deal PIN |
| GET | /api/notifications | Yes | Any | Get notifications |
| GET | /api/public/events | No | - | Public event listing |
| GET | /api/public/leaderboard | No | - | Leaderboard |
| GET | /health | No | - | Health check |

## Folder Structure

```
backend/src/
├── config/env.ts           # Validates all env vars at startup
├── controllers/            # Thin HTTP handlers
├── middlewares/
│   ├── auth.ts             # JWT authentication
│   ├── validate.ts         # Zod validation
│   ├── errorHandler.ts     # Global error handler
│   └── rateLimiter.ts      # Rate limiting
├── validators/             # Zod schemas per domain
├── utils/
│   ├── jwt.ts              # Access + refresh token utils
│   ├── ApiError.ts         # Custom error class
│   ├── ApiResponse.ts      # Standardized responses
│   └── logger.ts           # Winston logger
└── lib/prisma.ts           # Prisma client singleton
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Security

- JWT access tokens expire in 15 minutes
- Refresh tokens stored in HTTP-only, SameSite=Strict cookies
- All inputs validated with Zod schemas
- Rate limiting on auth endpoints
- Helmet security headers on all responses
- CORS restricted to configured origin
- No hardcoded secrets — server fails fast if env vars missing

## License

ISC
