import type {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import {ValidationError} from 'objection';
import {UniqueViolationError} from 'db-errors';
import UnauthorizedError from '../errors/UnauthorizedError';

export function apiErrorHandler(): ErrorRequestHandler {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api/')) {
      if (err instanceof ValidationError) {
        res.status(400).json({error: {type: 'validation', message: err.message}});
        next();
        return;
      } else if (err instanceof UniqueViolationError) {
        res.status(409).end();
        next();
        return;
      } else if (err instanceof UnauthorizedError) {
        res.status(401).end();
        next();
        return;
      }
    }
    next(err);
  };
}
