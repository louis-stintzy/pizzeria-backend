import { AppError } from './AppError';

export class DataBaseError extends AppError {
  constructor(message = 'Database error', details?: unknown) {
    super(message, 500, 'DATABASE_ERROR', details);
    Object.setPrototypeOf(this, DataBaseError.prototype);
  }
}
