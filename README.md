# Elysia with Bun runtime

## Development

First, copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Then start the development server:

```bash
bun run dev
```

## Database

This project uses **Drizzle ORM** with PostgreSQL by default. Want to use a
different database?

📖 **[Database Configuration Guide](src/db/DATABASE.md)** — Switch to MySQL,
SQLite, Turso, Neon, and more

## Deployment

This project supports **three deployment methods** — choose based on your needs:

| Method         | Best For                                   | Complexity | Cost          |
| -------------- | ------------------------------------------ | ---------- | ------------- |
| **Vercel**     | APIs, startups, serverless                 | Minimal    | Free - $20/mo |
| **PM2**        | Simple VPS, solo devs, budget hosting      | Low        | ~$5/mo        |
| **Pulumi/K8s** | Production apps, teams, full observability | High       | ~$20+/mo      |

📖 **[Deployment Comparison Guide](deploy/DEPLOYMENT_COMPARISON.md)** | 🧹
**[Remove Unwanted Deployment Options](deploy/CLEANUP.md)**

## Telemetry & Observability

This project includes a full observability stack with Tempo (tracing),
Prometheus (metrics), Loki (logs), and Grafana (visualization).

### Start Telemetry Services

```bash
# Generate prometheus.yml from environment variables and start all services
bun run telemetry:up

# Or manually generate config and start
bun run generate:prometheus
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f grafana

# Stop all services
bun run telemetry:down
# Or: docker compose down

# Restart a specific service
docker compose restart tempo
```

**Note:** `prometheus.yml` is auto-generated from the `METRICS_EXPORTER_PORT`
environment variable. If you change this port, regenerate the config with
`bun run generate:prometheus`.

### Optional Observability

Each observability feature can be independently enabled/disabled via environment
variables:

| Variable          | Default | Description                                  |
| ----------------- | ------- | -------------------------------------------- |
| `TRACING_ENABLED` | `TRUE`  | Enable/disable distributed tracing (Tempo)   |
| `METRICS_ENABLED` | `TRUE`  | Enable/disable Prometheus metrics collection |
| `LOGGING_ENABLED` | `TRUE`  | Enable/disable remote logging to Loki        |

```bash
# Example: Disable all observability for lightweight local development
TRACING_ENABLED=FALSE METRICS_ENABLED=FALSE LOGGING_ENABLED=FALSE bun run dev

# Example: Enable only logging for debugging
TRACING_ENABLED=FALSE METRICS_ENABLED=FALSE LOGGING_ENABLED=TRUE bun run dev
```

When disabled:

- **Tracing**: The telemetry plugin becomes a no-op
- **Metrics**: Helper functions (`createCounter`, `createHistogram`,
  `createGauge`) return no-op implementations
- **Logging**: Falls back to local `pino-pretty` console output instead of
  sending to Loki

### Service URLs

| Service    | URL                   | Purpose                 |
| ---------- | --------------------- | ----------------------- |
| Grafana    | http://localhost:3001 | Visualization dashboard |
| Prometheus | http://localhost:9090 | Metrics queries         |
| Tempo      | http://localhost:3200 | Tracing backend         |
| Loki       | http://localhost:3100 | Logs backend            |

### View in Grafana

1. Open http://localhost:3001
2. Go to **Explore** (compass icon)
3. Select data source:
   - **Prometheus** — for metrics
   - **Tempo** — for traces
   - **Loki** — for logs
