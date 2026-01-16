/**
 * Install @elysiajs/cron if you want to use elysia cron jobs
 * Uncomment the code below to enable it
 * Uncomment the code in routes/cron.ts to enable it
 * Uncomment the code in app/_app.ts to enable it
 * By default, trigger task cron is enabled since it much more
 * cost efficent on Sevalla
 */

// export { cron as createCron, Patterns as CronPatterns } from "@elysiajs/cron";

// export const CommonPatterns = {
//   EVERY_SECOND: "* * * * * *",
//   EVERY_5_SECONDS: "*/5 * * * * *",
//   EVERY_10_SECONDS: "*/10 * * * * *",
//   EVERY_30_SECONDS: "*/30 * * * * *",
//   EVERY_MINUTE: "* * * * *",
//   EVERY_5_MINUTES: "*/5 * * * *",
//   EVERY_10_MINUTES: "*/10 * * * *",
//   EVERY_30_MINUTES: "*/30 * * * *",
//   EVERY_HOUR: "0 * * * *",
//   DAILY_MIDNIGHT: "0 0 * * *",
//   DAILY_NOON: "0 12 * * *",
//   WEEKLY_MONDAY: "0 0 * * 1",
//   MONTHLY: "0 0 1 * *",
// } as const;
