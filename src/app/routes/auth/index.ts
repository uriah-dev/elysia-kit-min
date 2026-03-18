import { Elysia, type HTTPHeaders, type StatusMap } from "elysia";
import { type Context, routes } from "@routes/index";
import { requireAuth, type JwtPlugin } from "@src/lib/auth";
import { login, register, getMe } from "./service";
import { UsersInsertSchema } from "@db/schema/users";
import type { ElysiaCookie } from "elysia/cookies";
import { getRoutePrefix } from "@src/lib/utils";

export type AuthContext<T = {}> = Context<
  T & {
    jwt: JwtPlugin;
    headers: Record<string, string | undefined>;
    set: {
      headers: HTTPHeaders;
      status?: number | keyof StatusMap;
      redirect?: string;
      cookie?: Record<string, ElysiaCookie>;
    };
  }
>;

const ROUTE_NAME = "Auth";
export const config = {
  name: ROUTE_NAME,
  prefix: getRoutePrefix(ROUTE_NAME),
};

export const auth = new Elysia(config)
  .use(routes)
  .post("/login", login, {
    body: UsersInsertSchema.pick({ email: true }),
  })
  .post("/register", register, {
    body: UsersInsertSchema.pick({ email: true, name: true }),
  })
  .use(requireAuth())
  .get("/me", getMe);

export type Auth = typeof auth;
