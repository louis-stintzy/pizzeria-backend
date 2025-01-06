import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error(err);
    // todo: add logger
    // logger.error(`SQL Error: ${err.message}`, { query: text, params });
    throw new Error('Database query failed');
  }
};
