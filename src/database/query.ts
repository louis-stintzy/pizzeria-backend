import { pool } from './pool';

export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Database query Error:', err);
    // todo: add logger
    // logger.error(`SQL Error: ${err.message}`, { query: text, params });
    throw new Error('Database query failed');
  }
};
