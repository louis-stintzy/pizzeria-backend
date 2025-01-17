import { AppError } from './AppError';

export class DataBaseError extends AppError {
  constructor(message: string = 'Database error', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
    Object.setPrototypeOf(this, DataBaseError.prototype);
  }
}
