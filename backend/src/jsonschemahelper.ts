import {globSync} from 'glob';

export function getSchemaDefinitions(): { definitions: { [key: string]: any } } {
  const ret = {
    definitions: {} as { [key: string]: any },
  };

  const useJs = __filename.endsWith('.js');
  let patterns = [
    './models/**/*.ts',
  ];
  let patternExcludes = [
    './**/__tests__/*',
    './models/db/BaseModel.ts',
    './models/db/BaseModelId.ts',
    './models/db/BaseModelCreatedUpdated.ts',
    './models/db/User.ts',
    './models/db/UserSession.ts',
  ];
  if (useJs) {//in production the files have a js file extension
    patterns = patterns.map(e => e.replace(/.ts$/, '.js'));
    patternExcludes = patternExcludes.map(e => e.replace(/.ts$/, '.js'));
  }

  //update models
  const res = globSync(patterns, {cwd: __dirname, ignore: patternExcludes, absolute: true});
  const modules = res.map((file) => (
    //or use importSync https://stackoverflow.com/a/77308393
    [file, require(file.replace(__dirname, '.').replace(useJs ? '.js' : '.ts', ''))]
  )).reduce((l, r) => {
    l[r[0]] = r[1];
    return l;
  }, {} as any);

  for (let path in modules) {
    // console.log(path, modules[path]);
    const mod: any = modules[path];
    // console.log(path, mod, Object.keys(mod));
    for (const name of Object.keys(mod)) {
      const schema = mod[name]?.jsonSchemaWithReferences;
      if (!schema) {
        continue;
      }
      const clsname = name === 'default' ? mod[name].name : name;
      // console.log(name, mod[name], typeof mod[name], clsname, schema);

      ret.definitions[clsname] = schema;
    }
  }

  return ret;
}
