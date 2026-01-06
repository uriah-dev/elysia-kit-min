import { Elysia } from "elysia";
import { sayHello, sayHiPerson } from "./service";
import { PersonSchema } from "./schema";
import { type Context, routes } from "@routes/index";

export type HomeContext<T = {}> = Context<T>;

const ROUTE_NAME = "Home";
export const config = {
  name: ROUTE_NAME,
};


export const home = new Elysia(config)
  .use(routes);

home.get("/", sayHello);
home.post("/", sayHiPerson, {
  body: PersonSchema,
});
