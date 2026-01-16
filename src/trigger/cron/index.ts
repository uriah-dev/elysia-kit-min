import { schedules } from "@trigger.dev/sdk/v3";
import { hasValue, logger } from "@src/lib/utils";

export { schedules };

export const CronPatterns = {
  EVERY_MINUTE: "* * * * *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_10_MINUTES: "*/10 * * * *",
  EVERY_15_MINUTES: "*/15 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",

  EVERY_HOUR: "0 * * * *",
  EVERY_2_HOURS: "0 */2 * * *",
  EVERY_6_HOURS: "0 */6 * * *",
  EVERY_12_HOURS: "0 */12 * * *",

  DAILY_MIDNIGHT: "0 0 * * *",
  DAILY_NOON: "0 12 * * *",
  DAILY_6AM: "0 6 * * *",
  DAILY_6PM: "0 18 * * *",

  WEEKLY_MONDAY: "0 0 * * 1",
  WEEKLY_FRIDAY: "0 0 * * 5",
  WEEKLY_SUNDAY: "0 0 * * 0",

  MONTHLY_FIRST: "0 0 1 * *",
  MONTHLY_LAST: "0 0 L * *",
} as const;

export type ScheduleOptions = {
  cron: string;
  timezone?: string;
  externalId?: string;
  deduplicationKey: string;
};

export const scheduleManager = {
  async create(taskId: string, options: ScheduleOptions) {
    try {
      const schedule = await schedules.create({
        task: taskId,
        cron: options.cron,
        timezone: options.timezone || "UTC",
        externalId: options.externalId,
        deduplicationKey: options.deduplicationKey,
      });

      logger.info(
        {
          scheduleId: schedule.id,
          taskId,
          cron: options.cron,
          timezone: options.timezone,
        },
        "Schedule created"
      );

      return schedule;
    } catch (error: any) {
      logger.error(
        { taskId, error: error.message },
        "Failed to create schedule"
      );
      throw error;
    }
  },

  async retrieve(scheduleId: string) {
    try {
      const schedule = await schedules.retrieve(scheduleId);
      return schedule;
    } catch (error: any) {
      logger.error(
        { scheduleId, error: error.message },
        "Failed to retrieve schedule"
      );
      throw error;
    }
  },

  async list() {
    try {
      const schedulesList = await schedules.list();
      return schedulesList;
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to list schedules");
      throw error;
    }
  },

  async update(
    scheduleId: string,
    options: Partial<Omit<ScheduleOptions, "deduplicationKey">>
  ) {
    try {
      const updateData: any = {};

      if (hasValue(options.cron)) {
        updateData.cron = options.cron;
      }

      if (hasValue(options.timezone)) {
        updateData.timezone = options.timezone;
      }

      if (hasValue(options.externalId)) {
        updateData.externalId = options.externalId;
      }

      const schedule = await schedules.update(scheduleId, updateData);

      logger.info({ scheduleId }, "Schedule updated");
      return schedule;
    } catch (error: any) {
      logger.error(
        { scheduleId, error: error.message },
        "Failed to update schedule"
      );
      throw error;
    }
  },

  async deactivate(scheduleId: string) {
    try {
      await schedules.deactivate(scheduleId);
      logger.info({ scheduleId }, "Schedule deactivated");
      return true;
    } catch (error: any) {
      logger.error(
        { scheduleId, error: error.message },
        "Failed to deactivate schedule"
      );
      return false;
    }
  },

  async activate(scheduleId: string) {
    try {
      await schedules.activate(scheduleId);
      logger.info({ scheduleId }, "Schedule activated");
      return true;
    } catch (error: any) {
      logger.error(
        { scheduleId, error: error.message },
        "Failed to activate schedule"
      );
      return false;
    }
  },

  async delete(scheduleId: string) {
    try {
      await schedules.del(scheduleId);
      logger.info({ scheduleId }, "Schedule deleted");
      return true;
    } catch (error: any) {
      logger.error(
        { scheduleId, error: error.message },
        "Failed to delete schedule"
      );
      return false;
    }
  },

  async getTimezones() {
    try {
      const timezones = await schedules.timezones();
      return timezones;
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get timezones");
      throw error;
    }
  },
};
