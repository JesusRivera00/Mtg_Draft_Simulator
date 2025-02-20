require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.SUPABASE_DB_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.SUPABASE_DB_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
};