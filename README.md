# React + TanStack App

Full-stack starter with:
- React 18 + TypeScript + Vite
- TanStack Router (file-based, type-safe)
- TanStack Query (server state + optimistic updates)
- TanStack Table (server-side pagination + sorting)
- Auth-ready protected routes
- CRUD users feature
- Toast notifications
- Mock Express backend

## Quick start

### 1. Install root deps
npm install

### 2. Install backend deps
cd backend && npm install && cd ..

### 3. Run both frontend + backend
npm run dev

- Frontend → http://localhost:5173
- Backend  → http://localhost:4000

## Routes
| Path        | Description              |
|-------------|--------------------------|
| /           | Home                     |
| /users      | Users list (CRUD, paginated, sortable) |
| /login      | Login page               |
| /dashboard  | Protected route          |
