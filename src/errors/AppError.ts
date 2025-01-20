import { ErrorPayload } from '../@types/error';

// https://www.henoktsegaye.com/blogs/handling-error-in-express-typescript
// https://medium.com/@xiaominghu19922/proper-error-handling-in-express-server-with-typescript-8cd4ffb67188
// https://github.com/gusgad/youtube-tutorials/blob/nodejs-error-handling/01_extended_error_object_example.ts
// https://github.com/ipenywis/expressjs-mistakes/blob/main/src/api/mistakes/errorHandling.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly payload: ErrorPayload;
  public readonly isOperational: boolean;

  constructor(statusCode: number, errorCode: string, payload: ErrorPayload, isOperational = true) {
    super(payload.internalMessage); // err.message devient payload.internalMessage

    // pour que instanceof fonctionne correctement
    Object.setPrototypeOf(this, new.target.prototype); // new.target.prototype ou AppError.prototype (ClassName.prototype)

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.payload = payload;
    this.isOperational = isOperational; // Permet(rait) de distinguer les erreurs prévues/connues

    // https://dev.to/believer15/how-errorcapturestacktrace-works-3807
    // https://nodejs.org/api/errors.html#errorcapturestacktracetargetobject-constructoropt

    Error.captureStackTrace(this, this.constructor); // Permet de capturer la stack trace de l'erreur (Spécifique à Node.js / V8)
  }
}
