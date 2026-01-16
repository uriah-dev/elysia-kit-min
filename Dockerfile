# syntax=docker/dockerfile:1

# ---- Build Stage ----
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

# ---- Production Stage ----
FROM oven/bun:1-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package.json tsconfig.json bunfig.toml ./

COPY src ./src

ARG PORT=3000
ENV NODE_ENV=production
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["bun", "src/index.ts"]
