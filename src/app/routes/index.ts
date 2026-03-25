import { Elysia } from "elysia";
import { logger } from "@src/lib/utils";
import { getRouteName, tryWrapper } from "@src/lib/utils";
import { db } from "@src/db";
import { createQueue } from "@src/trigger/queue";
import { sendEmailTask } from "@src/trigger/email";
import { arcjetProtect } from "@src/lib/arcjet";
import { jwtAuth, requireApiKey } from "@src/lib/auth";

const deriveHandler = ({
  server,
  request,
}: Parameters<Parameters<Elysia["derive"]>[1]>[0]) => ({
  logger,
  startTime: Date.now(),
  ip: server?.requestIP(request),
  db,
  queue: {
    email: createQueue(sendEmailTask),
  },
});

const name = getRouteName();
export const routes = new Elysia({ name })
  .use(jwtAuth)
  .use(requireApiKey())
  .onBeforeHandle(
    { as: "scoped" },
    async ({ request, set }) =>
      await tryWrapper(async () => await arcjetProtect(request, set)),
  )
  .derive({ as: "global" }, deriveHandler);

export type Routes = typeof routes;
export type Context<T = {}> = ReturnType<typeof deriveHandler> & T;
