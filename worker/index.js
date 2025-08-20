const Boss = require('pg-boss');

(async () => {
  const boss = new Boss({ connectionString: process.env.DATABASE_URL, schema: process.env.BOSS_SCHEMA || 'pgboss' });
  await boss.start();
  console.log('Worker up (pg-boss started)');
})();
