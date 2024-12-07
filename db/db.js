import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config();

let sslmode = "";
if (process.env.APP_ENV === "prod") {
  sslmode = "?sslmode=require";
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL + sslmode,
});

export const db = drizzle(pool, { logger: true });
