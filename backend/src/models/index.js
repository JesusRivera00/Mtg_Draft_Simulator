const knex = require('knex');
const knexfile = require('../db/knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

const db = knex(config);

module.exports = db;