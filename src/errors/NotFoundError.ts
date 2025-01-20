import { ErrorPayload } from '../@types/error';
import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(payload: ErrorPayload) {
    super(404, 'NOT_FOUND', payload);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
