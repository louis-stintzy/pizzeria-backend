import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

// ErrorRequestHandler en Typescript attend une fonction qui prend 4 arguments et retourne void
// c'est pourquoi on ne fait pas return res.status().json() mais res.status().json() + return vide (ou pas de return)

export const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Log the error with details ; // Send a response to the client (withouth details)
  if (err instanceof AppError) {
    console.error(`[${err.errorCode}] - ${err.message}`, { stack: err.stack, details: err.details });
    res.status(err.statusCode).json({ errorCode: err.errorCode, message: err.message, details: err.details ?? null });
    return;
  }
  if (err instanceof Error) {
    console.error(`[INTERNAL_SERVER_ERROR] - ${err.message}`, { stack: err.stack });
    res.status(500).json({ errorCode: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' });
    return;
  }
  console.error(`[UNKNOWN_ERROR] - ${String(err)}`);
  res.status(500).json({ errorCode: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' });
};
