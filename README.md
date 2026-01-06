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
