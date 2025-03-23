import type {NextFunction, Request, RequestHandler, Response} from 'express';
import UnauthorizedError from '../errors/UnauthorizedError';
import UserInfo from '../models/api/v1/user/UserInfo';
import UserRepository from '../repository/UserRepository';
import type User from '../models/db/User';

export function isAuthenticatedMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (isAuthenticated(req)) {
    next();
  } else {
    authorizationFailedHandler()(req, res, next);
  }
}

export function authorizationFailedHandler(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api/')) {
      next(new UnauthorizedError());
    } else {
      next('route');
    }
  };
}

export function isAuthorizedMiddleware(permissions?: { default?: string }): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isAuthorized(req, permissions?.default)) {
      next();
    } else {
      authorizationFailedHandler()(req, res, next);
    }
  };
}

export function isAuthenticated(req: Request): boolean {
  return !!req.session.authed;
}

export function isAuthorized(req: Request, permission?: string): boolean {//TODO impl permissions
  return isAuthenticated(req);
}

export function sessionUserdataMiddleware(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.authed // not authed
      || req.session.user) { //user data already loaded
      next();
      return;
    }

    const userRepo = new UserRepository();
    let user: User | undefined = req.session.userId ? await userRepo.getById(req.session.userId) : undefined;

    let err;
    if (user) {
      req.session.user = UserInfo.fromUser(user);
      req.session.userId = user.id;
      err = await new Promise<void>((resolve, reject) => {
        //Save
        req.session.save(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    next(err);
  };
}
