import { Elysia } from "elysia";
import { getRoutePrefix } from "@src/lib/utils";
import { type Context, routes } from "@routes/index";
import {
  createUser,
  getUser,
  listUsers,
  updateUser,
  deleteUser,
  testMail,
} from "./service";
import { UsersInsertSchema, UsersUpdateSchema } from "@db/schema/users";
import { formatApiError } from "@src/lib/common";

export type UserContext<T = {}> = Context<T>;

const ROUTE_NAME = "User";
export const config = {
  name: ROUTE_NAME,
  prefix: getRoutePrefix(ROUTE_NAME),
};

export const user = new Elysia(config)
  .use(routes)
  .get("/", listUsers)
  .get("/:id", getUser)
  .post("/", createUser, {
    body: UsersInsertSchema,
    error: formatApiError,
  })
  .put("/:id", updateUser, {
    body: UsersUpdateSchema,
    error: formatApiError,
  })
  .delete("/:id", deleteUser)
  .post("/email", testMail, {
    body: UsersInsertSchema.pick({ email: true }),
    error: formatApiError,
  });
