import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Error', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
