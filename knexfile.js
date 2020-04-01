module.exports = {
  test: {
    client: "pg",
    version: "10.12",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "s3cr3t",
      database: "moneymgr"
    },
    migrations: {
      directory: "src/migrations"
    }
  }
};
