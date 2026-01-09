# syntax=docker/dockerfile:1

FROM oven/bun:1.1.8-slim

WORKDIR /app

COPY package.json tsconfig.json bunfig.toml ./
RUN bun install --frozen-lockfile --production

COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "src/index.ts"]