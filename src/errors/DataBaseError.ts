import { AppError } from './AppError';
import { ErrorPayload } from '../@types/error';

export class DataBaseError extends AppError {
  constructor(payload: ErrorPayload) {
    super(500, 'DATABASE_ERROR', payload);
    Object.setPrototypeOf(this, DataBaseError.prototype);
  }
}
