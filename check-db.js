const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function check() {
    try {
        const result = await sql`SELECT count(*) FROM expenses`;
        console.log('QUERY_RESULT:', JSON.stringify(result));
        process.exit(0);
    } catch (err) {
        console.error('QUERY_ERROR:', err);
        process.exit(1);
    }
}

check();
