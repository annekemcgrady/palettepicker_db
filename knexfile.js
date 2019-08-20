// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/color_schemes',
    migrations: {
      directory: './db/migrations/'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  testing: {
    client: 'pg',
    connection: 'postgress://localhost/color_schemes_test',
    migrations: {
      directory: './db/migrations/'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: 'postgress://localhost/color_schemes',
    migrations: {
      directory: './db/migrations'
    }
  }

};
