import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Validation Error', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
