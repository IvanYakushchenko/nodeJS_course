const { Client } = require('pg');
require('dotenv').config();

function logWithTime(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const postId = process.argv[2];
  if (!postId) {
    console.error('Необхідно передати ID поста як аргумент!');
    process.exit(1);
  }

  logWithTime('Writer: BEGIN');
  await client.query('BEGIN');

  logWithTime('Writer: UPDATE title to Temp');
  await client.query('UPDATE posts SET title=$1 WHERE id=$2', ['Temp', postId]);

  logWithTime('Writer: sleeping 5 seconds before COMMIT...');
  await client.query('SELECT pg_sleep(5)');

  logWithTime('Writer: COMMIT');
  await client.query('COMMIT');

  await client.end();
})();