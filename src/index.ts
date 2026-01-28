import { server } from "@app/_app";
import { env } from "@src/env";
import {
  buildServiceUrl,
  hasValue,
  isDevEnv,
  logger,
  trySyncWrapper,
} from "@lib/utils";

export type Server = typeof server;

const PORT = (isDevEnv() ? env.APP_PORT : process.env.PORT)!;

const result = trySyncWrapper(() => {
  server.listen({ hostname: "0.0.0.0", port: PORT });
  logger.info(`🦊 Server is running at ${buildServiceUrl(PORT)}`);
  return { success: true };
});

if (!hasValue(result)) {
  logger.error("Failed to start server");
  process.exit(1);
}
