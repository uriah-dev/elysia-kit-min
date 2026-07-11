import { Elysia } from "elysia";
import { sayHello, sayHiPerson } from "./service";
import { PersonSchema } from "./schema";
import { type Context, routes } from "@routes/index";
import { formatApiError } from "@src/lib/common";

export type HomeContext<T = {}> = Context<T>;

const ROUTE_NAME = "Home";
export const config = {
  name: ROUTE_NAME,
};

export const home = new Elysia(config)
  .use(routes)
  .get("/", sayHello)
  .post("/", sayHiPerson, {
    body: PersonSchema,
    error: formatApiError,
  });
