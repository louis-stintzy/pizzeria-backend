import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    console.error(`[${err.errorCode}] - ${err.message}`, { stack: err.stack, details: err.details });
    return res
      .status(err.statusCode)
      .json({ errorCode: err.errorCode, message: err.message, details: err.details ?? null });
  }
}
