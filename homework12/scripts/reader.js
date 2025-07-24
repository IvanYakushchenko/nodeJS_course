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

  for (let i = 1; i <= 3; i++) {
    await client.query('BEGIN');
    await client.query('SET TRANSACTION READ ONLY');
    await client.query('LOCK TABLE posts IN SHARE MODE');

    const res = await client.query('SELECT title FROM posts WHERE id=$1', [postId]);
    logWithTime(`Reader: attempt ${i}, title = ${res.rows[0].title}`);

    await client.query('COMMIT');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await client.end();
})();