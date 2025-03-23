import type {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import UnauthorizedError from '../errors/UnauthorizedError';

export function errorLogHandler(): ErrorRequestHandler {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      if (err instanceof UnauthorizedError) {
      } else {
        console.error(err);
      }
    }
    next(err);
  };
}
