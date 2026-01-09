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

## Client Type Safety

This template provides a `/types` endpoint that generates TypeScript types from
your OpenAPI specification for use in separate client projects.

### Download Types

**Option 1: Manual download**

```bash
curl http://localhost:3000/types -o src/api.d.ts
```

**Option 2: Automated script**

Create a script (e.g., `scripts/sync-types.ts`) in your client project:

```typescript
const API_URL = process.env.API_URL || "http://localhost:3000";

const response = await fetch(`${API_URL}/types`);
const types = await response.text();

await Bun.write("src/api.d.ts", types);
console.log("✅ API types synced from", API_URL);
```

Add to your client's `package.json`:

```json
{
    "scripts": {
        "sync-types": "bun run scripts/sync-types.ts"
    }
}
```

### Usage with openapi-fetch

```bash
bun add openapi-fetch
```

```typescript
import createClient from "openapi-fetch";
import type { paths } from "./api";

const client = createClient<paths>({ baseUrl: "http://localhost:3000" });

// Type-safe API calls
const { data } = await client.GET("/user/{id}", {
    params: { path: { id: "123" } },
});
```

Re-download the types file whenever your API routes change to keep your client
in sync.
