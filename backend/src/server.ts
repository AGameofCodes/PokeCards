import express, {type Express} from 'express';
import session from 'express-session';
import {ConfigProvider, ConfigType, getSessionSettings} from './config/confighelper';
import {initDb, migrateDb} from './knex';
import {registerRoutes} from './routes';
import type {Knex} from 'knex';
import ConfigWatcher from './config/configwatcher';
import {isDevEnv} from './util/env';
import type http from 'http';
import path from 'path';
// import {fileURLToPath} from 'url';
import {apiErrorHandler} from './middleware/apierror';
import {errorLogHandler} from './middleware/errorlog';
import DbStore from './session/store';
import {sessionUserdataMiddleware} from './middleware/auth';
import {initGlobals} from './util/GlobalInit';
import {seedDb} from './DbSeed';
import {uncaughtErrorHandler} from './middleware/UncaughtErrorHandler';
import compression from 'compression';
import {iocContainer} from './ioc';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Server {
  // @ts-ignore TS6133
  private configWatcher!: ConfigWatcher;

  private config!: ConfigType;
  private express: Express | undefined;
  private server: http.Server | undefined;
  private expressHost: string | undefined;
  private expressPort: number | undefined;
  private knex: Knex | undefined;

//region init once
  constructor() {
    this.initOnceOnly();
  }

  private initOnceOnly(): void {
    initGlobals();
    this.initConfigChangeWatcher();
    this.initShutdownHooks();
  }

  private initConfigChangeWatcher(): void {
    if (isDevEnv()) {
      const files = [path.resolve(__dirname, './config.js')];
      files.push(path.resolve(__dirname, './config.dev.js'));
      this.configWatcher = new ConfigWatcher(files, () => this.onConfigChanged());
    }
  }

  private initShutdownHooks(): void {
    process.once('SIGUSR2', () => {
      this.queueStop().then(() => {
        process.kill(process.pid, 'SIGUSR2');
      });
    });
    process.once('SIGINT', () => {
      this.queueStop().then(() => {
        process.kill(process.pid, 'SIGINT');
      });
    });
  }

//endregion

//region init
  async init(configOverrides?: any): Promise<void> {
    this.config = await iocContainer().get(ConfigProvider).get();
    await this.initExpress();
    await this.initDatabase();
  }

  private async initExpress(): Promise<void> {
    this.expressHost = this.config.server.host ?? 'localhost';
    this.expressPort = this.config.server.port ?? 3000;

    this.express = express();

    const sessionStore = new DbStore();

    //middlewares
    this.express.use(compression());
    // await registerOpenApiFirst(this.express, this.config);
    this.express.use(session(getSessionSettings(this.config, sessionStore)));
    this.express.use(sessionUserdataMiddleware());
    this.express.use(express.json());
    registerRoutes(this.express, this.config);
    // RegisterRoutes(app);
    this.express.use(errorLogHandler());
    this.express.use(apiErrorHandler());
    // registerOpenApiLast(this.express);
    this.express.use(uncaughtErrorHandler());
  }

  private async initDatabase(): Promise<void> {
    this.knex = await initDb(this.config, false);
    if (!await migrateDb(this.knex)) {
      throw new Error('Error while migrating database!');
    }
    this.knex = await initDb(this.config, true);
    await seedDb(this.knex);
  }

//endregion

//region start
  async queueStart(reboot: boolean = false): Promise<void> {
    return this.queueOp(() => this.start(reboot));
  }

  private async start(reboot: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.express) {
        reject(new Error('Server not initialized!'));
        return;
      }
      this.server = this.express.listen(this.expressPort!, this.expressHost!, () => {
        if (!reboot) {
          console.log('Started server at http://' + this.expressHost + ':' + this.expressPort + '/');
        }
        resolve();
      }).on('error', err => console.error(err));
    });
  }

//endregion

//region stop
  async queueStop(reboot: boolean = false): Promise<void> {
    return this.queueOp(() => this.stop(reboot));
  }

  async stop(reboot: boolean = false): Promise<void> {
    if (!reboot) {
      console.log('Stopping server');
    }
    await this.stopExpress();
    await this.stopDatabase();
  }

  private stopExpress(): Promise<void> {
    const promises: Promise<void>[] = [];

    //stop server
    promises.push(new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      } else {
        this.server.close((err: Error | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    }));

    //cleanup
    return Promise.allSettled(promises)
      .then(_ => undefined)
      .finally(() => {
        this.express = undefined;
        this.server = undefined;
      });
  }

  private async stopDatabase(): Promise<void> {
    if (!this.knex) {
      return;
    }
    await this.knex.destroy();
    this.knex = undefined;
  }

//endregion

//region reboot
  async queueReboot(): Promise<void> {
    return this.queueOp(() => this.reboot());
  }

  private async reboot(): Promise<void> {
    await this.stop(true);
    await this.init();
    await this.start(true);
  }

//endregion

//region server start/stop queue
  private opQueueTail = Promise.resolve();

  private queueOp(op: () => Promise<void>): Promise<void> {
    this.opQueueTail = this.opQueueTail
      .then(op)
      .catch(err => console.log('Error in server start/stop loop:', err));
    return this.opQueueTail;
  }

//endregion

  private async onConfigChanged(): Promise<void> {
    console.log('Config changed. Restarting');
    await this.queueReboot();
  }
}
