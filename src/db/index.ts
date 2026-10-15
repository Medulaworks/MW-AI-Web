// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";

// const databaseUrl = process.env.DATABASE_URL;

// if (!databaseUrl) {
//   throw new Error("DATABASE_URL is required");
// }

// const globalForDb = globalThis as typeof globalThis & {
//   __arenaNextJsPostgresqlPool?: Pool;
// };

// export const pool =
//   globalForDb.__arenaNextJsPostgresqlPool ??
//   new Pool({
//     connectionString: databaseUrl,
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForDb.__arenaNextJsPostgresqlPool = pool;
// }

// export const db = drizzle(pool);

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
