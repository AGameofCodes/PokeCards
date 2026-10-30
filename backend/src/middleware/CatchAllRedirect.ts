import {Express, NextFunction, Request, RequestHandler, Response} from 'express';

export default function catchAllRedirect(app: Express, path: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    req.url = path;
    app(req, res);
  };
}