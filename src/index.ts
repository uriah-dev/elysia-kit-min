import { server } from "@app/_app";
import { env } from "@src/env";
import {
  buildServiceUrl,
  hasValue,
  logger,
  trySyncWrapper,
  tryWrapper,
} from "@lib/utils";

export type Server = typeof server;

const PORT = process.env.PORT || env.APP_PORT!;

const result = trySyncWrapper(() => {
  server.listen({});
  logger.info(`🦊 Server is running at ${buildServiceUrl(PORT)}`);
  return { success: true };
});

if (!hasValue(result)) {
  logger.error("Failed to start server");
  process.exit(1);
}
