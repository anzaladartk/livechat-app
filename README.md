# LiveChat

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node) and Socket.io — rooms, live messaging, typing indicators, join/leave notifications, and user profiles.

## Features

- Email/password auth with JWT (register, login, session verification)
- Browse, search, create, join, and leave chat rooms
- Real-time messaging via Socket.io, with paginated message history over REST
- Live typing indicators and join/leave system messages
- Members list per room, kept in sync in real time
- User profile: editable name and avatar (URL-based), account stats (rooms joined, messages sent)
- Toast notifications for room activity

## Tech Stack

**Frontend** — React 19, Vite, React Router, Zustand, Tailwind CSS, Axios, socket.io-client
**Backend** — Node.js, Express, Mongoose (MongoDB), Socket.io, JWT, bcrypt, express-validator
**Database** — MongoDB Atlas

## Project Structure

This is an npm-workspaces monorepo:

```
packages/
  client/   React + Vite frontend
  server/   Express + Socket.io backend
```

## Prerequisites

- Node.js >= 16, npm >= 8
- A MongoDB connection string (a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster works)

## Setup

```bash
# from the repo root
npm install
```

Create the two env files from their examples:

```bash
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env
```

`packages/server/.env`:

| Variable       | Description                                      |
| -------------- | ------------------------------------------------- |
| `PORT`         | Port the API/socket server listens on             |
| `MONGODB_URI`  | Your MongoDB connection string                    |
| `JWT_SECRET`   | Random secret used to sign auth tokens             |
| `NODE_ENV`     | `development` or `production`                      |
| `CORS_ORIGIN`  | URL of the frontend allowed to call this API        |

`packages/client/.env`:

| Variable          | Description                          |
| ----------------- | ------------------------------------- |
| `VITE_API_URL`    | Base URL of the backend REST API      |
| `VITE_SOCKET_URL` | URL the client connects Socket.io to  |

## Running locally

```bash
npm run dev
```

Runs both the client (`http://localhost:5173`) and server concurrently. Or run them individually:

```bash
npm run dev:client
npm run dev:server
```

## Testing

```bash
npm run test:server
```

Backend test suite (Jest + Supertest) covering health, auth (register/login/verify), and access control.

## Building for production

```bash
npm run build          # builds all workspaces
npm run build:client   # client only
npm run start:server   # runs the built server
```

## API Overview

| Method | Endpoint                  | Description                          |
| ------ | -------------------------- | ------------------------------------- |
| POST   | `/api/auth/register`       | Create an account                     |
| POST   | `/api/auth/login`          | Log in, receive a JWT                 |
| GET    | `/api/auth/verify`         | Verify the current token              |
| GET    | `/api/rooms`                | List rooms (public directory)         |
| POST   | `/api/rooms`                | Create a room                         |
| GET    | `/api/rooms/:roomId`        | Room details + members                |
| POST   | `/api/rooms/:roomId/join`   | Join a room                           |
| POST   | `/api/rooms/:roomId/leave`  | Leave a room                          |
| GET    | `/api/messages/:roomId`     | Paginated message history             |
| GET    | `/api/users/profile`        | Current user's profile + stats        |
| PATCH  | `/api/users/profile`        | Update name / avatar                  |
| GET    | `/api/health`                | Health check                          |

## Socket.io Events

| Event               | Direction       | Description                          |
| -------------------- | --------------- | ------------------------------------- |
| `joinRoom`           | client → server | Subscribe to a room's live events     |
| `leaveRoom`          | client → server | Unsubscribe from a room               |
| `sendMessage`        | client → server | Send a message to a room              |
| `messageReceived`    | server → client | New message (chat or system) broadcast |
| `typing` / `stopTyping` | client → server | Report typing state                 |
| `userTyping` / `userStoppedTyping` | server → client | Someone else's typing state |
| `roomMembersList`    | server → client | Members snapshot on join              |
| `error`              | server → client | Socket-level error message            |

Room join/leave notifications arrive as `messageReceived` system messages, posted when the corresponding REST endpoint is called.

## Deployment

Free-tier friendly: **Vercel** (frontend) + **Render** (backend) + **MongoDB Atlas** (database).

1. **Backend (Render):** New Web Service → root directory `packages/server` → build `npm install` → start `npm start`. Set `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `CORS_ORIGIN` (your Vercel URL) as environment variables.
2. **Frontend (Vercel):** Import project → root directory `packages/client` → framework Vite. Set `VITE_API_URL` and `VITE_SOCKET_URL` to your Render backend URL.
3. Update `CORS_ORIGIN` on Render once you have the final Vercel URL.

Render's free tier sleeps after periods of inactivity, so the first request after idle can take 30–50 seconds to wake the socket connection back up.

## License

Private project — not licensed for reuse.
