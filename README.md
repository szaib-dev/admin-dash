# Admin Dashboard

A clean React admin panel for managing users and restaurants in the `coder-gyan` platform.

Built with `React`, `TypeScript`, `Vite`, `TanStack Query`, `Axios`, `Tailwind CSS`, and `Shadcn UI`, this dashboard is designed for authenticated admin workflows such as:

- signing in and registering
- browsing and managing platform users
- filtering users by role
- searching users by name
- creating, updating, and deleting restaurants
- searching restaurants by name or address

## Preview

This app currently includes:

- `Login` and `Register` flows
- `Users` page with:
  - search
  - role filter
  - create/update/delete actions
- `Restaurants` page with:
  - search
  - create/update/delete actions

## Tech Stack

- `React 19`
- `TypeScript`
- `Vite`
- `React Router`
- `TanStack React Query`
- `Axios`
- `Tailwind CSS v4`
- `Radix UI`
- `Zod`
- `Vitest`

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create or update `.env` in the `admin-dashboard` folder:

```env
VITE_AUTH_SERVICE_URL=http://localhost:YOUR_BACKEND_PORT
```

Example:

```env
VITE_AUTH_SERVICE_URL=http://localhost:5000
```

This value is used by:

- `AxiosAuth` for `/api/user`
- `AxiosMembers` for `/api/member`
- `AxiosTenants` for `/api/tenant`

### 3. Start the development server

```bash
pnpm dev
```

The app will run with Vite's local development server.

## Available Scripts

```bash
pnpm dev
```

Starts the dashboard in development mode.

```bash
pnpm build
```

Builds the production bundle.

```bash
pnpm preview
```

Previews the production build locally.

```bash
pnpm lint
```

Runs ESLint.

```bash
pnpm test-w
```

Runs Vitest in watch mode.

## Project Structure

```text
admin-dashboard/
├── public/
├── src/
│   ├── components/
│   ├── http/
│   ├── pages/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── tenants/
│   │   └── users/
│   ├── routes.tsx
│   └── validation/
├── .env
├── package.json
└── vite.config.ts
```

## Routing Overview

Current main routes:

- `/auth/login`
- `/auth/register`
- `/users`
- `/resturants`

Note: the route is currently spelled `/resturants` in code to match the existing project structure.

## Data Flow

The dashboard talks to the backend through three Axios clients:

- `AxiosAuth`
- `AxiosMembers`
- `AxiosTenants`

It also includes an auth refresh interceptor so expired access tokens can be refreshed automatically when possible.

## Current Behavior

### Users

- empty search shows non-admin users
- role filter supports `ALL`, `MANAGER`, and `USER`
- search works with query params so the UI state is shareable in the URL

### Restaurants

- empty search shows all restaurants
- search filters by restaurant name or address
- the old status-style filter UI has been removed

## Notes

- This project uses `withCredentials: true`, so backend CORS and cookies must be configured correctly.
- The dashboard depends on the companion backend service being available and reachable through `VITE_AUTH_SERVICE_URL`.

## Future Improvements

- add dashboard summary cards and analytics to the homepage
- add pagination for larger user and restaurant datasets
- add better empty states and loading skeletons
- add stronger test coverage for CRUD flows
- rename `/resturants` to `/restaurants` when backend/frontend naming is unified

## License

This project is part of the `coder-gyan` workspace.
