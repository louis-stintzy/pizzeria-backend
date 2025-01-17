import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, 403, 'FORBIDDEN_ERROR', details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
