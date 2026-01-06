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

## Email

Run email dev to preview your emails:

```bash
bun run email dev
```

If the above command doesn't work, you can run:

```bash
pnpm email dev /
npm email dev /
yarn email dev
```

This project uses **Resend** for sending emails. Want to use a different email
service?

📖 **[Email Configuration Guide](src/emails/EMAIL.md)** — Switch to SendGrid,
Nodemailer, and more
