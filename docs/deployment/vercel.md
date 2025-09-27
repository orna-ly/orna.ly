# Vercel Deployment Guide

This guide walks through everything you need to do before you push the Orna Jewelry store to production on [Vercel](https://vercel.com/).

## 1. Prerequisites

- A Vercel account with access to the project’s Git repository.
- A production PostgreSQL database (Vercel Postgres, Neon, Supabase, Railway, etc.).
- The [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) if you want to manage env variables or deploy from the terminal.
- Bun `^1.1` installed locally when testing the build command before deploying.

## 2. Required environment variables

Create the variables in the Vercel dashboard (`Project Settings → Environment Variables`) or with the CLI (`vercel env add`). The table below mirrors the sample values in [`.env.example`](../../.env.example); replace everything with the production credentials.

| Name                                                 | Description                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_PROVIDER`                                  | Either `postgresql` (default) or `sqlite`, matching the engine powering your production database.                                                 |
| `DATABASE_URL`                                       | Connection string for your production database.                                                                                                   |
| `NEXTAUTH_URL`                                       | Fully-qualified URL that Vercel should serve (e.g. `https://orna.yourdomain.com`).                                                                |
| `NEXTAUTH_SECRET`                                    | A cryptographically secure string used by NextAuth.js. Generate with `openssl rand -base64 32`.                                                   |
| `NEXT_PUBLIC_APP_URL`                                | Public URL of the site. Used in links and client-side fetches.                                                                                    |
| `NEXT_PUBLIC_APP_NAME`                               | Display name that appears in metadata and UI.                                                                                                     |
| `UPLOAD_DIR`                                         | Directory where product and marketing assets should be written. Keep it in sync with the storage strategy you use (S3 bucket, Vercel Blob, etc.). |
| `MAX_FILE_SIZE`                                      | Maximum upload size accepted by the API (in bytes).                                                                                               |
| `PAYMENT_GATEWAY_API_KEY` / `PAYMENT_GATEWAY_SECRET` | Credentials for the production payment processor.                                                                                                 |

If you are migrating data from the legacy Laravel app you also need the `OLD_DB_*` variables. You can safely omit them otherwise.

> [!TIP]
> Run `vercel env pull .env.production` locally to sync the remote variables into a file that matches your production configuration.

## 3. Database preparation

1. Provision the production database and note the connection string.
   - For PostgreSQL, use a managed service such as Vercel Postgres, Neon, Supabase, Railway, or your cloud provider of choice and keep `DATABASE_PROVIDER=postgresql`.
   - For SQLite, point `DATABASE_URL` to a remote LibSQL/Turso instance or another SQLite-compatible service. File-based SQLite databases are **not** persisted between Vercel deployments, so always use a hosted option in production.

2. Apply the Prisma schema against the new database from your local machine:

   ```bash
   bun install
   bun run db:deploy
   bun run db:seed
   ```

   `db:deploy` automatically chooses between `prisma migrate deploy` (PostgreSQL) and `prisma db push` (SQLite) based on `DATABASE_PROVIDER`. When the schema evolves, create a new migration locally (`bunx prisma migrate dev`) while targeting PostgreSQL, or re-run `db:deploy` for SQLite-backed environments.

3. Update any external integrations (payment gateways, storage buckets, email providers) so that the credentials you enter in Vercel point to production services.

## 4. Configure Vercel build settings

Vercel detects the project as a Next.js app automatically, but we pin the commands to Bun to match local development:

- **Install Command**: `bun install`
- **Build Command**: `bun run vercel-build`
- **Output Directory**: leave the default (`.next`)

You can configure these under **Project Settings → Build & Development Settings** or by keeping the `vercel.json` file committed in the repository.

## 5. Triggering the first deployment

1. Push your branch to the linked Git provider (GitHub, GitLab, or Bitbucket).
2. Vercel creates a preview deployment. Verify that the build log runs the Prisma client generation step and that all environment variables are available.
3. Visit the preview URL to make sure pages render correctly, API routes respond with `200 OK`, and database reads/writes work as expected.
4. When everything looks good, press **Promote to Production** in the Vercel dashboard, or merge the branch into `main` to trigger an automatic production build.

## 6. Post-deployment checklist

- [ ] Create a `NEXTAUTH_SECRET` rotation schedule and store the value in your secrets manager.
- [ ] Set up custom domains (Project Settings → Domains) and configure DNS records.
- [ ] Enable [Vercel Analytics](https://vercel.com/docs/analytics) if you need runtime metrics.
- [ ] Configure webhooks or cron jobs that point to the new production URL.
- [ ] Monitor the first production deployment in the [Vercel Dashboard](https://vercel.com/dashboard) and in your logging provider.

Following the steps above ensures the application builds with Bun, Prisma has a generated client ready for serverless functions, and every runtime secret required by the storefront is in place before you promote the deployment to production.
