# Pokecards backend

## Development

### Setup
Run `npm i`

### Configuration
The configuration can be found in the `config` directory. To override the defaults
in the `config.json`, copy the `config.json` and give it the name `config.dev.json`.
Both configs will be merged where the values of the `config.dev.json` take precedence.
Values that are not overridden/absent in the `config.dev.json` will use the values from
the `config.json`.

### Running
Run `npm run dev`. On windows run `npm run dev-win`.
This will start a node server that automatically reboots when the code is changed. 

### Creating database migrations
Run `npm run migrate:make`. This will create new migration in the `migrations` directory.
Then, rename the migration to a meaningful name but keep the date in the name.
Also, have a look the existing migrations and code your migration in the same manner.
Finally, register the migration in the `migrations/_migrations.ts` file.

### Testing
Run `npm run test`. The backend uses `jest` as the testing framework.

### OpenApi specs
The backend automatically generates an open api spec. All models will automatically 
to the spec along with all endpoints. However, the endpoints will have the parameters 
and responses missing due to the limitations in the openapi-generator package. Those need
to be filled manually.
