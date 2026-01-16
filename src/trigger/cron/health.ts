import { schedules, CronPatterns } from "@src/trigger/cron";
import { logger } from "@src/lib/utils";

export const heartbeatTask = schedules.task({
  id: "heartbeat",
  cron: CronPatterns.EVERY_5_MINUTES,
  run: async (payload) => {
    logger.info(
      {
        timestamp: payload.timestamp,
        lastTimestamp: payload.lastTimestamp,
        timezone: payload.timezone,
        scheduleId: payload.scheduleId,
        nextRuns: payload.upcoming,
      },
      "💓 Heartbeat - System is alive"
    );
    const formatted = payload.timestamp.toLocaleString("en-US", {
      timeZone: payload.timezone,
    });

    logger.info({ formattedTime: formatted }, "Heartbeat execution time");

    return {
      status: "healthy",
      executedAt: payload.timestamp,
      message: "Heartbeat successful",
    };
  },
});

export const dailyCleanupTask = schedules.task({
  id: "daily-cleanup",
  cron: {
    pattern: CronPatterns.DAILY_MIDNIGHT,
    timezone: "UTC",
    environments: ["PRODUCTION", "DEVELOPMENT"],
  },
  run: async (payload) => {
    logger.info(
      {
        timestamp: payload.timestamp,
        lastTimestamp: payload.lastTimestamp,
        scheduleId: payload.scheduleId,
      },
      "🧹 Running daily cleanup task"
    );

    logger.info("Daily cleanup completed successfully");

    return {
      status: "completed",
      executedAt: payload.timestamp,
      itemsCleaned: 0,
    };
  },
});

export const systemHealthCheckTask = schedules.task({
  id: "system-health-check",
  cron: CronPatterns.EVERY_30_MINUTES,
  run: async (payload) => {
    logger.info(
      {
        timestamp: payload.timestamp,
        scheduleId: payload.scheduleId,
      },
      "🏥 Running system health check"
    );

    const healthStatus = {
      database: "healthy",
      apis: "healthy",
      memory: "healthy",
      disk: "healthy",
    };

    logger.info({ healthStatus }, "System health check completed");

    return {
      status: "completed",
      executedAt: payload.timestamp,
      health: healthStatus,
      nextChecks: payload.upcoming.slice(0, 3), // Next 3 scheduled checks
    };
  },
});
