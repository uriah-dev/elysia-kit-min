import { Elysia } from "elysia";
import { createCron, CronPatterns, CommonPatterns } from "@lib/cron";
import { logger } from "@lib/utils";

const heartbeatCron = createCron({
  name: "heartbeat",
  pattern: CronPatterns.everySeconds(30),
  run() {
    logger.info("💓 Heartbeat - Server is alive");
  }
});

export const cronJobs = new Elysia({ name: "cron-jobs", prefix: "cron" })
  .use(heartbeatCron)
  .get("/heartbeat/stop", ({ store: { cron: { heartbeat } } }) => {
    heartbeat.stop();
    return { success: true, message: "Heartbeat cron job stopped" };
  })
  .get("/heartbeat/start", ({ store: { cron: { heartbeat } } }) => {
    heartbeat.trigger();
    return { success: true, message: "Heartbeat cron job started" };
  })
  .get("/heartbeat/status", ({ store: { cron: { heartbeat } } }) => {
    return { 
      name: "heartbeat",
      isRunning: heartbeat.isRunning(),
      isBusy: heartbeat.isBusy(),
      currentRun: heartbeat.currentRun(),
      previousRun: heartbeat.previousRun(),
      nextRun: heartbeat.nextRun()
    };
  });
export { createCron, CronPatterns, CommonPatterns };
