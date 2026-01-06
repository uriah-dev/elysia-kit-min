// Test environment setup
// Set test environment variables before importing app modules

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.APP_PORT = "3000";
process.env.APP_NAME = "elysia-kit-test";
process.env.APP_URL = "http://localhost:3000";
process.env.LOG_LEVEL = "fatal";
