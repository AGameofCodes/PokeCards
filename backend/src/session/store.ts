import {type SessionData, Store} from 'express-session';
import UserSession from '../models/db/UserSession';
import UserSessionRepository from '../repository/UserSessionRepository';
import {UUID} from 'node:crypto';

export default class DbStore extends Store {
  private repo = new UserSessionRepository();

  override get(sid: UUID, callback: (err: any, session?: SessionData | null) => void): void {
    // console.log('store.get', sid);
    this.repo.getById(sid)
      .then(userSession => {
        // console.log('store.get', sid, userSession)
        callback(undefined, userSession?.data);
      })
      .catch(err => callback(err, undefined));
  }

  override set(sid: UUID, session: SessionData, callback?: (err?: any) => void): void {
    // console.log('store.set', sid, session);
    // console.log('store.set', sid)
    this.repo.getById(sid)
      .then(maybeUserSession => {
        if (maybeUserSession) {
          return Promise.resolve(maybeUserSession);
        } else {
          if (!session.user || !session.user.id) {
            throw new Error('User information not present in session data for session ' + sid);
          }
          return this.repo.addIgnoreDuplicate(UserSession.new(sid, session.user?.id));
        }
      })
      .then(userSession => {
        userSession.data = session;
        userSession.userId = session.user?.id;
        userSession.expires = session.cookie.expires ?? new Date();
        return this.repo.update(userSession);
      })
      .then(success => {
        if (!success) throw new Error('Failed to save session data for session ' + sid);
        if (callback) callback(undefined);
      })
      .catch(err => {
        if (callback) callback(err);
      });
  }

  override destroy(sid: UUID, callback?: (err?: any) => void): void {
    // console.log('store.destroy', sid);
    this.repo.removeIfPresent(sid)
      .then(_ => {
        if (callback) callback(undefined);
      })
      .catch(err => {
        if (callback) callback(err);
      });
  }

  override all(callback: (err: any, obj?: { [sid: UUID]: SessionData; } | null) => void): void {
    // console.log('store.all')
    this.repo.getAll()
      .then(userSessions => {
        const map: any = {};
        userSessions.forEach(userSession => map[userSession.id] = userSession.data);
        if (callback) callback(undefined, map);
      })
      .catch(err => {
        if (callback) callback(err, undefined);
      });
  }

  override length(callback: (err: any, length: number) => void): void {
    // console.log('store.length')
    this.repo.count()
      .then(count => {
        if (callback) callback(undefined, count);
      })
      .catch(err => {
        if (callback) callback(err, -1);
      });
  }

  override clear(callback?: (err?: any) => void): void {
    // console.log('store.clear')
    this.repo.truncate()
      .then(_ => {
        if (callback) callback(undefined);
      })
      .catch(err => {
        if (callback) callback(err);
      });
  }

  override touch(sid: UUID, session: SessionData, callback?: () => void): void {
    // console.log('store.touch', sid, session);

    let cookieExpires: Date;
    // console.log('touch pre session timeout:', session.cookie.expires);
    cookieExpires = session.cookie.expires ?? new Date();

    this.repo.getById(sid)
      .then(maybeUserSession => {
        if (!maybeUserSession) {
          return Promise.resolve(null);
        }
        maybeUserSession.data = session;
        maybeUserSession.expires = cookieExpires;
        return this.repo.update(maybeUserSession);
      })
      .then(success => {
        if (!success) throw new Error('Failed to save session data for session ' + sid);
        if (callback) callback();
      })
      .catch(err => {
        if (callback) callback();
      });
  }
}