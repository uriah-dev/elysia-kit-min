import { jwt } from "@elysiajs/jwt";
import { env } from "@src/env";
import { apiError } from "@src/lib/common";
import { hasValue, trySyncWrapper, tryWrapper } from "./utils";
import { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { type User, usersTable } from "@src/db/schema";
import type { DBType } from "@src/db";
import type { AuthContext } from "@src/app/routes/auth";

export type JwtPayload = {
  sub: string; // User ID
  email: string;
  iat?: number;
  exp?: number;
};

export type JwtPlugin = {
  sign(payload: any): Promise<string>;
  verify(token: string): Promise<any>;
};

export type JwtContext = {
  jwt: JwtPlugin;
  headers: any;
  set: any;
};

export const jwtAuth = jwt({
  name: "jwt",
  secret: env.JWT_SECRET,
  exp: env.JWT_EXPIRES_IN,
});

export function extractTokenFromHeader(headers: Headers): string | null {
  const authHeader = headers.get("Authorization");
  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !hasValue(token)) {
    return null;
  }

  return token;
}

export async function authenticate({
  jwt: jwtPlugin,
  headers,
  set,
}: JwtContext): Promise<JwtPayload | null> {
  const token = trySyncWrapper(() => extractTokenFromHeader(headers));
  if (!token) {
    set.status = 401;
    return null;
  }
  const payload = await tryWrapper<JwtPayload>(await jwtPlugin.verify(token));
  if (!payload) {
    set.status = 401;
    return null;
  }
  return payload;
}

export async function optionalAuth({
  jwt: jwtPlugin,
  headers,
}: {
  jwt: JwtPlugin;
  headers: Headers;
}): Promise<JwtPayload | null> {
  const token = trySyncWrapper(() => extractTokenFromHeader(headers));
  if (!token) {
    return null;
  }
  const payload = await tryWrapper<JwtPayload>(await jwtPlugin.verify(token));
  if (!payload) {
    return null;
  }
  return payload;
}

export type ProtectedHandler<
  T extends { jwt: JwtPlugin; headers: Headers; set: any } = JwtContext,
> = (context: T & { user: JwtPayload }) => Promise<any>;

export function protectedRoute<T extends JwtContext>(
  handler: ProtectedHandler<T>,
) {
  return async (context: T) => {
    const user = await authenticate({
      jwt: context.jwt,
      headers: context.headers,
      set: context.set,
    });

    if (!user) {
      return apiError("UNAUTHORIZED", "Authentication required");
    }

    return handler({
      ...context,
      user,
    } as T & { user: JwtPayload });
  };
}

export async function signToken(
  jwtPlugin: any,
  user: Pick<User, "id" | "email">,
): Promise<string> {
  return await jwtPlugin.sign(getPayload(user));
}

export const getUser = async ({
  db,
  user,
}: {
  user: JwtPayload;
  db: DBType;
}) => {
  const dbUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, user.sub),
    columns: { id: true, email: true, name: true, role: true },
  });

  if (!hasValue(dbUser)) {
    throw apiError("NOT_FOUND", "User not found");
  }
  return dbUser;
};

export const getPayload = (user: Pick<User, "id" | "email">) => {
  const payload: Omit<JwtPayload, "iat" | "exp"> = {
    sub: user.id!,
    email: user.email!,
  };
  return payload;
};

export const getUserByEmail = async ({
  db,
  email,
}: {
  email: string;
  db: DBType;
}) => {
  const dbUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    columns: { id: true, email: true, name: true, role: true },
  });

  if (!hasValue(dbUser)) {
    throw apiError("NOT_FOUND", "User not found");
  }
  return dbUser;
};

type UserType = "USER" | "ADMIN";
export const requireAuth = (allowedRoles?: UserType | UserType[]) => {
  const allowedTypes = Array.isArray(allowedRoles)
    ? allowedRoles
    : allowedRoles
      ? [allowedRoles]
      : undefined;

  return new Elysia({ name: "AuthMiddleware" })
    .use(jwtAuth)
    .derive({ as: "scoped" }, async (context) => {
      const { set, db } = context as unknown as AuthContext;
      const user = await authenticate({
        jwt: context.jwt,
        headers: context.headers,
        set,
      });
      if (!hasValue(user)) {
        set.status = 401;
        throw apiError("UNAUTHORIZED", "Invalid or expired session token");
      }

      const dbUser = await getUser({ db, user });

      if (allowedTypes && !allowedTypes.includes(dbUser.role)) {
        set.status = 403;
        throw apiError("FORBIDDEN", "Access denied for this user role");
      }

      return {
        user: dbUser,
      };
    });
};
