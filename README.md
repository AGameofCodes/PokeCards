# Pokecards

# Build
Execute the `build.sh` script. The build artefacts will be stored in the `dist` directory.

# Configuration
The configuration can be found in the `dist/config` directory. To override the defaults
in the `config.json`, copy the `config.json` and give it the name `config.prod.json`.
Both configs will be merged where the values of the `config.prod.json` take precedence.
Values that are not overridden/absent in the `config.prod.json` will use the values from
the `config.json`.

# Executing
After building, execute the `start.sh` in the `dist` directory.

# Development
The system is split up into 2 projects, backend and frontend.
Please refer to the README.md files in the respective directories.
- [frontend README.md](./frontend/README.md)
- [backend README.md](./backend/README.md)
