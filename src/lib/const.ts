import { env } from "@src/env";
import { upper } from "./utils";

export const DEFAULT_APP_NAME = "Elysia Kit Min";

export const AUTH_CONFIG = {
  user: "Bearer",
  public: "GBRAK",
};

export const CORS_CONFIG = {
  origin: env.ALLOWED_ORIGINS,
  credentials: true,
};

export const OPENAPI_CONFIG = {
  path: "/api/docs",
  documentation: {
    info: {
      title: `${upper(DEFAULT_APP_NAME)} Documentation`,
      version: "0.0.1",
    },
  },
  scalar: {
    layout: "classic",
    persistAuth: true,
  },
};
