import {getSchemaDefinitions} from '../jsonschemahelper';
import {GLOBALS} from './GlobalVar';

export function initGlobals() : void {
  GLOBALS.jsonSchemaDefinitions = getSchemaDefinitions()
}

//TODO maybe with export declare var or something similar