import addFormats from 'ajv-formats';
import {AjvValidator, type JSONSchema, Model, type Validator} from 'objection';
import {mergeDeep} from '../../util/merge';
import {GLOBALS} from '../../util/GlobalVar';

export default abstract class BaseModel extends Model {
  static override get jsonSchema(): JSONSchema {
    const refs = this.findRefs(this.jsonSchemaWithReferences);
    const defs = refs.map(e => GLOBALS.jsonSchemaDefinitions.definitions[e.substring(e.lastIndexOf('/') + 1)]);
    let newRefs = [];
    do {
      newRefs = defs
        .map(d => this.findRefs(d))
        .reduce((l, r) => l.concat(r), [])
        .filter(e => !refs.includes(e));
      refs.push(...newRefs);
      defs.push(...newRefs.map(e => GLOBALS.jsonSchemaDefinitions.definitions[e.substring(e.lastIndexOf('/') + 1)]));
    } while (newRefs.length > 0);
    this.traverseObject(defs, (key: any, value: any, obj: any, path: string) => {
      if (key === '$ref' && typeof value === 'string') {
        obj[key] = value.substring(value.lastIndexOf('/') + 1);
      }
    });
    const defsMap = mergeDeep({}, ...defs.filter(e => e).map(e => ({[e.$id]: e})));
    return mergeDeep({}, this.jsonSchemaWithReferences, {definitions: defsMap});
  }

  static get jsonSchemaWithReferences(): JSONSchema {
    return {
      $id: 'BaseModel',
      type: 'object',
    };
  }

  static override createValidator(): Validator {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
        ajv.addSchema(this.jsonSchema);
      },
      options: {
        addUsedSchema: false,
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
      },
    });
  }

  private static findRefs(obj: any | Array<any>, path: string = ''): string[] {
    const ret: string[] = [];
    this.traverseObject(obj, (key: any, value: any) => {
      if (key === '$ref' && typeof value === 'string') {
        ret.push(value);
      }
    });
    return ret;
  }

  private static traverseObject(obj: any | Array<any>, fn: (key: any, value: any, obj: any, path: string) => void, path: string = ''): void {
    if (Array.isArray(obj)) {
      (obj as Array<any>).forEach((e, i) => this.traverseObject(e, fn, path + '[' + i + ']'));
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newPath = (path.length > 0 ? path + '.' : '') + key;
        fn(key, value, obj, newPath);
        if (typeof value === 'object' || Array.isArray(value)) {
          return this.traverseObject(value, fn, newPath);
        }
      });
    }
  }
}