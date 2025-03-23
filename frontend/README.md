# Pokecards frontend

## Development

### Setup
Run `npm i`
Run `npm run setup`

### Running
Run `npm run dev`.
This will start the frontend with hot reload enabled 

### Configuration
The configuration can be found in the `config` directory. To override the defaults
in the `config.json`, copy the `config.json` and give it the name `config.dev.json`.
Both configs will be merged where the values of the `config.dev.json` take precedence.
Values that are not overridden/absent in the `config.dev.json` will use the values from
the `config.json`.

### Generating api clients from the OpenApi spec
Run `npm run setup`. This will regenerate and build the api clients.

### Testing
For unit tests run `npm run test:unit`.
For end-to-end test run `npm run test:e2e` or `npm run test:e2e:dev`.
