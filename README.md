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
# Apply the latest Prisma schema changes
bun run db:push
# Optional: seed the catalog and sample orders
bun run db:seed
bun run dev
```

The development server runs on [http://localhost:3001](http://localhost:3001). Environment variables required for local development are documented in [`SETUP.md`](SETUP.md) and mirrored in [`.env.example`](.env.example). Re-run `bun run db:push` whenever new columns or enum values are added so that your database stays aligned with the codebase.

## Available scripts

| Command                | Description                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `bun run dev`          | Start the development server with Turbopack on port `3001`.                            |
| `bun run build`        | Create an optimized production build.                                                  |
| `bun run start`        | Run the production server locally (after `bun run build`).                             |
| `bun run lint`         | Execute ESLint across the project.                                                     |
| `bun run db:push`      | Push the Prisma schema to the configured database.                                     |
| `bun run db:seed`      | Seed the database with sample catalog, order, and contact data.                        |
| `bun run vercel-build` | Production build command used by Vercel (runs Prisma client generation automatically). |

## Tech stack highlights

- **Next.js 15 App Router** with server components, React 19, and internationalised routing.
- **Tailwind CSS 4** and Shadcn UI components for a responsive, RTL-friendly design system.
- **Prisma ORM** backed by PostgreSQL, with seed scripts for realistic fixtures.
- **Jotai** for client-side state (cart, language switching, and admin filters).
- **TypeScript** everywhere for compile-time safety.

## Deployment

Detailed instructions for preparing infrastructure, configuring environment variables, and running production builds on Vercel live in [`docs/deployment/vercel.md`](docs/deployment/vercel.md).
