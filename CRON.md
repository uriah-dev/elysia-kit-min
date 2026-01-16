# Trigger.dev Scheduled Tasks - Usage Guide

This project now includes Trigger.dev scheduled tasks (cron jobs) for running recurring tasks.

## Quick Start

### 1. Start the Trigger.dev dev server

```bash
bun run trigger:dev
```

This will register all scheduled tasks with Trigger.dev and start listening for triggers.

### 2. View your scheduled tasks

The scheduled tasks will appear in the Trigger.dev dashboard. You can view them at:

- Local development: http://localhost:3030 (or the URL shown in your terminal)
- Production: https://cloud.trigger.dev

### Declarative Approach (Recommended)

Add a new task to `src/trigger/tasks/scheduled-jobs.ts`:

```typescript
import { schedules, CronPatterns } from "@src/trigger/scheduled";

export const myTask = schedules.task({
  id: "my-custom-task",
  cron: CronPatterns.EVERY_HOUR, // or "0 * * * *"
  run: async (payload) => {
    // Your task logic here
    console.log("Task executed at:", payload.timestamp);

    return {
      status: "completed",
      executedAt: payload.timestamp,
    };
  },
});
```

### Imperative Approach (Dynamic Scheduling)

Use the `scheduleManager` to create schedules programmatically:

```typescript
import { scheduleManager } from "@src/lib/cron";
import { dynamicTask } from "@src/trigger/tasks/scheduled-jobs";

// In your route or service
const schedule = await scheduleManager.create(dynamicTask.id, {
  cron: "0 8 * * *", // 8am daily
  timezone: "America/New_York",
  externalId: "user_123", // For multi-tenant apps
  deduplicationKey: "user_123-daily-reminder",
});
```

## Common Cron Patterns

Use the `CronPatterns` export from `@src/lib/cron`:

```typescript
import { CronPatterns } from "@src/lib/cron";

// Examples:
CronPatterns.EVERY_MINUTE; // "* * * * *"
CronPatterns.EVERY_5_MINUTES; // "*/5 * * * *"
CronPatterns.EVERY_HOUR; // "0 * * * *"
CronPatterns.DAILY_MIDNIGHT; // "0 0 * * *"
CronPatterns.DAILY_6AM; // "0 6 * * *"
CronPatterns.WEEKLY_MONDAY; // "0 0 * * 1"
CronPatterns.MONTHLY_FIRST; // "0 0 1 * *"
```

## Managing Schedules

The `scheduleManager` provides utilities for managing schedules:

```typescript
import { scheduleManager } from "@src/lib/cron";

// List all schedules
const schedules = await scheduleManager.list();

// Retrieve a specific schedule
const schedule = await scheduleManager.retrieve(scheduleId);

// Update a schedule
await scheduleManager.update(scheduleId, {
  cron: "0 */2 * * *", // Change to every 2 hours
});

// Deactivate a schedule (pause it)
await scheduleManager.deactivate(scheduleId);

// Activate a deactivated schedule
await scheduleManager.activate(scheduleId);

// Delete a schedule permanently
await scheduleManager.delete(scheduleId);

// Get all available timezones
const timezones = await scheduleManager.getTimezones();
```

## Accessing Schedule Payload

Every scheduled task receives a payload with useful information:

```typescript
export const myTask = schedules.task({
  id: "my-task",
  cron: "0 * * * *",
  run: async (payload) => {
    // When the task was scheduled to run (UTC Date)
    payload.timestamp;

    // When the task last ran (UTC Date or undefined if first run)
    payload.lastTimestamp;

    // The timezone the schedule was registered with
    payload.timezone; // e.g., "UTC", "America/New_York"

    // The schedule ID (for managing the schedule)
    payload.scheduleId;

    // Optional external ID (for multi-tenant apps)
    payload.externalId; // e.g., "user_123"

    // Next 5 scheduled execution times
    payload.upcoming; // Array of Date objects

    // Format timestamp in schedule's timezone
    const formatted = payload.timestamp.toLocaleString("en-US", {
      timeZone: payload.timezone,
    });
  },
});
```

## Environment-Specific Schedules

You can limit schedules to specific environments:

```typescript
export const prodOnlyTask = schedules.task({
  id: "production-task",
  cron: {
    pattern: "0 0 * * *",
    timezone: "UTC",
    environments: ["PRODUCTION", "STAGING"], // Won't run in dev/preview
  },
  run: async (payload) => {
    // Production-only logic
  },
});
```

## Deployment

When you're ready to deploy your scheduled tasks:

```bash
bun run trigger:deploy
```

This will deploy your tasks to Trigger.dev's cloud infrastructure.

## Important Notes

- **Dev environment**: Scheduled tasks only trigger when `bun run trigger:dev` is running
- **Production environment**: Scheduled tasks only trigger from the latest deployed version
- **Cron format**: Standard 5-field cron syntax (minute hour day month day-of-week)
- **Timezone**: All cron patterns are interpreted in the specified timezone (defaults to UTC)

## Documentation

For more information, see:

- [Trigger.dev Scheduled Tasks Documentation](https://trigger.dev/docs/tasks/scheduled)
- [Cron Expression Guide](https://crontab.guru/)
- [IANA Timezone List](https://cloud.trigger.dev/timezones)
