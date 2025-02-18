import { ErrorPayload } from '../@types/error';
import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(payload: ErrorPayload) {
    super(400, 'VALIDATION_ERROR', payload);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
