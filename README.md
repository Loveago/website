# Modern Blog (Next.js 14 + Prisma + NextAuth)

A full‑stack blog platform with user and admin roles.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + simple ShadCN‑style components
- NextAuth (credentials) for authentication
- Prisma ORM + SQLite (easily switch to Postgres)

## Features
- User signup/login
- Create, edit, delete own posts
- Admin panel at `/admin` to manage posts/users and view summary
- Role‑based access (user/admin)
- Responsive UI with light/dark mode

## Getting Started (Local)

1) Install Node.js LTS (18+)

2) Install dependencies:
```bash
npm install
```

3) Create env file:
- Copy `env.example` to `.env` and adjust values.

4) Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5) (Optional) Seed an admin user using env `ADMIN_EMAIL`/`ADMIN_PASSWORD`:
```bash
npm run seed
```

6) Start the dev server:
```bash
npm run dev
```
Visit http://localhost:3000

## Deployment (Vercel)
- Set the same environment variables in the Vercel project: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL` (use Vercel Postgres or your own DB).
- Push this repo to Git and import in Vercel.
- Run `prisma migrate deploy` in a Vercel build step if using a hosted DB.

## Scripts
- `npm run dev`: Start dev server
- `npm run build`: Build
- `npm start`: Start production server
- `npm run prisma:migrate`: Run Prisma migrations (dev)
- `npm run prisma:studio`: Open Prisma Studio
- `npm run seed`: Seed admin user

## Notes
- Admin panel: `/admin` (requires admin role)
- User dashboard: `/dashboard`
- Auth pages: `/login`, `/signup`

## Switch to PostgreSQL
- Update `DATABASE_URL` in `.env` to a Postgres connection string.
- Run `npx prisma migrate dev` to create schema.
