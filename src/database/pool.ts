import { Pool } from 'pg';
import { DATABASE_URL } from '../dotenv/config';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});
