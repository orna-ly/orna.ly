# Orna Jewelry Storefront

A multilingual e-commerce experience for Orna Jewelry built with Next.js 15, the App Router, Tailwind CSS 4, Prisma, and Bun. The application includes a full admin area for managing products, orders, and contact requests alongside the public storefront.

## Project resources

- [Local development setup](SETUP.md)
- [Complete migration notes](COMPLETE_MIGRATION_GUIDE.md)
- [Type safety improvements](TYPE_IMPROVEMENTS_SUMMARY.md)
- [Vercel deployment guide](docs/deployment/vercel.md)

## Quick start

```bash
bun install
# Apply the latest Prisma migrations or push the schema for SQLite
bun run db:deploy
# Optional: seed the catalog and sample orders
bun run db:seed
bun run dev
```

The development server runs on [http://localhost:3001](http://localhost:3001). Environment variables required for local development are documented in [`SETUP.md`](SETUP.md) and mirrored in [`.env.example`](.env.example). When you change the Prisma schema locally, create a new migration (`bunx prisma migrate dev`) so `bun run db:migrate` (and consequently `bun run db:deploy`) stays in sync across environments.

## Available scripts

| Command                | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `bun run dev`          | Start the development server with Turbopack on port `3001`.                                            |
| `bun run build`        | Create an optimized production build.                                                                  |
| `bun run start`        | Run the production server locally (after `bun run build`).                                             |
| `bun run lint`         | Execute ESLint across the project.                                                                     |
| `bun run db:deploy`    | Deploy the Prisma schema based on `DATABASE_PROVIDER` (migrate for PostgreSQL, push for SQLite).       |
| `bun run db:migrate`   | Apply the committed Prisma migrations to the configured database.                                      |
| `bun run db:push`      | Rapidly sync the Prisma schema during prototyping (local-only).                                        |
| `bun run db:seed`      | Seed the database with sample catalog, order, and contact data.                                        |
| `bun run vercel-build` | Production build command used by Vercel (runs `db:deploy` and Prisma client generation automatically). |

## Tech stack highlights

- **Next.js 15 App Router** with server components, React 19, and internationalised routing.
- **Tailwind CSS 4** and Shadcn UI components for a responsive, RTL-friendly design system.
- **Prisma ORM** backed by PostgreSQL (or hosted SQLite services), with seed scripts for realistic fixtures.
- **Jotai** for client-side state (cart, language switching, and admin filters).
- **TypeScript** everywhere for compile-time safety.

## Deployment

Detailed instructions for preparing infrastructure, configuring environment variables, and running production builds on Vercel live in [`docs/deployment/vercel.md`](docs/deployment/vercel.md).

## Containerised runtime

To run the storefront alongside PostgreSQL with Docker:

```bash
cp docker/.env.docker.example docker/.env.docker # optional – adjust values as needed
docker compose up --build
```

The compose file automatically loads variables from `docker/.env.docker`; update it (or supply overrides via `--env-file`) to point at production-grade credentials before deploying anywhere outside your laptop. The application becomes available on [http://localhost:3000](http://localhost:3000) while PostgreSQL listens on port `5432`. The container entrypoint runs `bunx prisma migrate deploy` on startup so schema changes flow through automatically. Set `SKIP_MIGRATIONS=1` on the `web` service if you prefer to manage migrations manually.
