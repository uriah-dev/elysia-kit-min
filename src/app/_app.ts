import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { html } from "@elysiajs/html";
import { env } from "@src/env";
import { home } from "@routes/home";
import { user } from "@routes/user";
import { health } from "@routes/health";
// import { cronJobs } from "@routes/cron";

export const app = new Elysia({ name: env.APP_NAME })
  .use(cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  }))
  .use(html())
  .use(openapi())
  // .use(cronJobs)
  .use(health)
  .use(home)
  .use(user);

export const server = app;
