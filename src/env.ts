import { z } from "zod";
import { buildFromSchema, getEnvValue } from "@lib/env-utils";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  APP_PORT: z.coerce.number().default(3000).optional(),
  APP_NAME: z.coerce.string(),
  APP_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development").optional(),

  // Trigger.dev
  TRIGGER_SECRET_KEY: z.string().optional(),
  TRIGGER_PROJECT_ID: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  RESEND_MAIL: z.email().optional(),

  // Arcjet
  ARCJET_KEY: z.string().optional(),
  ARCJET_ENV: z.enum(["development", "production"]).default("development").optional(),

  // CORS
  ALLOWED_ORIGINS: z.string().optional().transform((v) => v?.split(",").map((v) => v.trim()) || []),
});
export type EnvSchemaType = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse(
  buildFromSchema(EnvSchema, getEnvValue(EnvSchema))
);
