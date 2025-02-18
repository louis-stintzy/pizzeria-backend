import { AppError } from './AppError';
import { ErrorPayload } from '../@types/error';

export class ForbiddenError extends AppError {
  constructor(payload: ErrorPayload) {
    super(403, 'FORBIDDEN_ERROR', payload);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
