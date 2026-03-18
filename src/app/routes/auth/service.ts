import { type User, usersTable } from "@src/db/schema/users";
import { eq } from "drizzle-orm";
import { apiSuccess, apiError, apiTryWrapper } from "@src/lib/common";
import type { AuthContext } from ".";
import { getUserByEmail, signToken } from "@src/lib/auth";

export const login = async ({
  body,
  jwt,
  logger,
  db,
}: AuthContext<{ body: { email: string }; jwt: any }>) =>
  apiTryWrapper(
    async () => {
      const { email } = body;

      const user = await getUserByEmail({ db, email });
      if (!user) {
        logger.warn({ email }, "Login failed - user not found");
        return apiError("UNAUTHORIZED", "Invalid credentials");
      }

      const token = await signToken(jwt, user);
      logger.info({ userId: user.id }, "User logged in");

      return apiSuccess({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    },
    {
      errorMessage: "Failed to login",
      onError: (error) => {
        logger.error({ error: error.message }, "Login failed");
        return null;
      },
    },
  );

export const register = async ({
  body,
  jwt,
  logger,
  db,
}: AuthContext<{ body: { email: string; name: string }; jwt: any }>) =>
  apiTryWrapper(
    async () => {
      const { email, name } = body;

      const existing = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });
      if (existing) {
        logger.warn({ email }, "Registration failed - email exists");
        return apiError("VALIDATION_ERROR", "Email already registered");
      }

      const [user] = await db
        .insert(usersTable)
        .values({ email, name })
        .returning();

      const token = await signToken(jwt, user);
      logger.info({ userId: user.id }, "User registered");

      return apiSuccess({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    },
    {
      errorMessage: "Failed to register",
      onError: (error) => {
        logger.error({ error: error.message }, "Registration failed");
        if (error.code === "23505") {
          return apiError("VALIDATION_ERROR", "Email already registered");
        }
        return null;
      },
    },
  );

export const getMe = async ({
  logger,
  user,
}: AuthContext<{ user: Pick<User, "id" | "email" | "name"> }>) =>
  apiTryWrapper(
    async () => {
      logger.info({ userId: user.id }, "User profile retrieved");
      return apiSuccess({
        user,
      });
    },
    {
      errorMessage: "Failed to get user profile",
      onError: (error) => {
        logger.error({ error: error.message }, "Failed to get profile");
        return null;
      },
    },
  );
