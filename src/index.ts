import { server } from "@app/_app";
import { env } from "@src/env";
import { buildServiceUrl, logger } from "@lib/utils";

export type Server = typeof server;

const PORT = env.APP_PORT;
server.listen(PORT);

logger.info(`🦊 Server is running at ${buildServiceUrl(PORT)}`);