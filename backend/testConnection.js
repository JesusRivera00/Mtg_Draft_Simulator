require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString:'postgresql://postgres.iilrqegqnjodstvqzvhp:TPeyyQqUkbusnAmP@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

client.connect()
  .then(() => {
    console.log('Connected to Supabase database successfully!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('Current time:', res.rows[0]);
    return client.end();
  })
  .catch((err) => {
    console.error('Error connecting to Supabase database:', err);
  });