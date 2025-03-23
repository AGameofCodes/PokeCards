import type {ErrorRequestHandler, NextFunction, Request, Response} from 'express';

export function uncaughtErrorHandler(): ErrorRequestHandler {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    let msg = err;
    if (err instanceof Error) {
      msg = err.stack ?? err.message;
    }
    res.status(500).end(`<pre>${msg}</pre>`);
    next();
  };
}
