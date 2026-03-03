import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const pool = new pg.Pool({
    connectionString:
        process.env.DATABASE_URL ||
        "postgres://centro:centro@localhost:5432/centro_db",
});

export const db = drizzle(pool, { schema });
export { pool };
