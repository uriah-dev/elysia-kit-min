// Test environment setup

import { AUTH_CONFIG } from "@src/lib/const";

// Set test environment variables before importing app modules
export const authHeaders = {
  "x-api-key": `${AUTH_CONFIG.public} ${process.env.API_KEY}`,
  "user-agent": "bun-test",
};

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.APP_PORT = "3000";
process.env.APP_NAME = "elysia-kit-test";
process.env.APP_URL = "http://localhost:3000";
process.env.LOG_LEVEL = "fatal";
process.env.API_KEY = "your-api-key-at-least-32-characters-long";
delete process.env.ARCJET_KEY;
