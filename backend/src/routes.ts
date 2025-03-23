import {Express, static as _static} from 'express';
import type {ConfigType} from './config/confighelper';
import catchAllRedirect from './middleware/CatchAllRedirect';
import {RegisterRoutes} from './tsoa.gen/routes';

export function registerRoutes(express: Express, config: ConfigType) {
  RegisterRoutes(express);
  express.use(_static('_client')); //for production
  express.use(catchAllRedirect(express, '/'));
}
