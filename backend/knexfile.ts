// only used for migration creation in dev
//TODO there seems to unneccessary stuff in here
const config = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./dev.sqlite3"
  },
  migrations: {
    directory: './src/migrations'
  }
};

module.exports = config;
