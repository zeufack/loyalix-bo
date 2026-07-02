# syntax=docker/dockerfile:1
# ==========================================================================
# Production image — Next.js (standalone output), pnpm.
# Multi-stage: deps -> builder -> runner. Runs as non-root `node`.
# Deployed via Dokploy (Traefik + dokploy-network, see docker-compose.yml).
# ==========================================================================

FROM node:24-alpine AS base
# libc6-compat: Next.js / SWC native binaries expect glibc symbols on Alpine.
RUN apk add --no-cache libc6-compat
# Activate pnpm via corepack (version pinned by package.json "packageManager").
RUN corepack enable

# ---- deps: install node_modules with a frozen lockfile ----
FROM base AS deps
WORKDIR /app
# pnpm-workspace.yaml carries the `allowBuilds` map (pnpm 11) approving native
# build scripts (sharp, esbuild, unrs-resolver) — must be present or the install errors.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- builder: compile the standalone server ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* vars are inlined into the client JS bundle at build time —
# setting them on the runner container at deploy time has NO effect. Must be
# passed as a build arg (see docker-compose.yml build.args).
ARG NEXT_PUBLIC_NESTJS_API_URL
ENV NEXT_PUBLIC_NESTJS_API_URL=$NEXT_PUBLIC_NESTJS_API_URL
RUN pnpm build

# ---- runner: minimal runtime ----
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# public assets
COPY --from=builder --chown=node:node /app/public ./public

# prerender cache dir owned by the runtime user
RUN mkdir .next && chown node:node .next

# standalone server + static assets (output: "standalone")
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

# /api/auth/session is explicitly public (bypasses the auth middleware) and
# returns 200 {} unauthenticated with no upstream calls — cheaper and more
# reliable than hitting "/" (which 307-redirects to /login under middleware).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/api/auth/session >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
