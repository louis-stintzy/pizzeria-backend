export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details?: any;
  isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // Permet de distinguer les erreurs prévues/connues

    // https://dev.to/believer15/how-errorcapturestacktrace-works-3807
    // https://nodejs.org/api/errors.html#errorcapturestacktracetargetobject-constructoropt

    Error.captureStackTrace(this, this.constructor);
  }
}
