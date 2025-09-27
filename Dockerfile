# syntax=docker/dockerfile:1.7
FROM oven/bun:1.1 as base
WORKDIR /app

FROM base as deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY prisma ./prisma
RUN bunx prisma generate

FROM base as builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.bun ./
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN bun run build

FROM base as runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.bun ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package.json bun.lock ./
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "run", "start"]
