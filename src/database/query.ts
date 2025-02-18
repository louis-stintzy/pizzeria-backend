import { AppError, DataBaseError } from '../errors';
import { pool } from './pool';

export const query = async (text: string, params?: unknown[]) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    if (err instanceof AppError) throw err; // Si l'erreur est une instance de AppError, on la throw
    throw new DataBaseError({
      // Sinon, on crée une nouvelle instance de DataBaseError
      publicMessage: 'Database error',
      internalMessage: 'Database query error',
      details: err,
    });
  }
};
