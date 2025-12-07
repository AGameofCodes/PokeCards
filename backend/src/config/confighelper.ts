import {randomUUID} from 'crypto';
import type express from 'express';
import type {SessionOptions, Store} from 'express-session';
import DbStore from '../session/store';
import {mergeDeep} from '../util/merge';
import {isDevEnv} from '../util/env';
import * as fs from 'node:fs';

export type ConfigType = {
  server: {
    host: string,
    port: number,
    baseUrl: string,
    features: {
      auth: {//TODO move up on level
        enable: boolean,//TODO rename to login
        register: boolean,
      }
    },
    session: SessionOptions,
  },
  database: {
    use: string,
    // [key: string]: Knex.Config //TODO
  },
};

export class ConfigProvider {
  private config: ConfigType | null = null;

  async get(): Promise<ConfigType> {
    if (!this.config) {
      this.config = await loadConfig();
    }
    return this.config!;
  }
}

export async function loadConfig(configOverrides?: any): Promise<ConfigType> {
  const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
  let mergedConfig = mergeDeep({}, config);
  if (isDevEnv()) {
    console.log('Loading config.dev.json');
    try {
      let devConfig = JSON.parse(fs.readFileSync('./config/config.dev.json', 'utf8'));
      mergedConfig = mergeDeep(mergedConfig, devConfig);
    } catch (_) {
    }
  } else {
    console.log('Loading config.prod.json');
    try {
      let devConfig = JSON.parse(fs.readFileSync('./config/config.prod.json', 'utf8'));
      mergedConfig = mergeDeep(mergedConfig, devConfig);
    } catch (_) {
    }
  }
  if (![undefined, null].includes(configOverrides)) {
    mergedConfig = mergeDeep(mergedConfig, configOverrides);
  }
  return mergedConfig;
}

export function getSessionSettings(config: ConfigType, store?: Store): SessionOptions {
  return Object.assign({}, config.server.session, {
    genid: function (req: express.Request): string {
      return randomUUID();
    },
    store: store ?? new DbStore(), //Store | undefined,
    cookie: {
      expires: undefined, //disable deprecated option
      signed: true, //sign cookies
      httpOnly: true, //no reading the cookie from js
      // encode?: ((val: string) => string) | undefined;
    },
    /**
     * Forces the session to be saved back to the session store, even if the session was never modified during the request.
     * Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel requests to your server
     *   and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes (this behavior also depends on what store you're using).
     *
     * The default value is `true`, but using the default has been deprecated, as the default will change in the future.
     * Please research into this setting and choose what is appropriate to your use-case. Typically, you'll want `false`.
     *
     * How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the `touch` method.
     * If it does, then you can safely set `resave: false`.
     * If it does not implement the `touch` method and your store sets an expiration date on stored sessions, then you likely need `resave: true`.
     */
    resave: false,//boolean | undefined,
    saveUninitialized: false, //don't save empty new sessions
    unset: 'keep', //keep session, when unsetting req.session
  });
}