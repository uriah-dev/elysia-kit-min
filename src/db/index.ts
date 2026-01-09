import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@src/env";
import * as schema from "@db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let clientInstance: ReturnType<typeof postgres> | null = null;

const getDB = () => {
  if (!env.DATABASE_URL) {
    throw Error("DATABASE_URL is not configured");
  }
  if (!dbInstance) {
    if (!clientInstance) {
      clientInstance = postgres(env.DATABASE_URL);
    }
    dbInstance = drizzle(clientInstance, { schema });
  }
  return dbInstance;
};

export const db = new Proxy({} as ReturnType<typeof getDB>, {
  get(_, prop) {
    return (getDB() as any)[prop];
  }
});

export type DBType = ReturnType<typeof getDB>;
