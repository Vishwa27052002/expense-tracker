import { db } from './db';
import { expenses } from './db/schema';
import { sql } from 'drizzle-orm';

async function diagnose() {
    try {
        // Check if table exists
        const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'expenses'
      );
    `);
        console.log('Table "expenses" exists:', tableCheck[0]);

        // Count records
        const count = await db.execute(sql`SELECT count(*) FROM expenses`);
        console.log('Record count:', count[0]);

        // Get first few records (without userId filter to see if anything is there)
        const records = await db.execute(sql`SELECT * FROM expenses LIMIT 5`);
        console.log('Sample records:', records);

        process.exit(0);
    } catch (err) {
        console.error('Diagnosis failed:', err);
        process.exit(1);
    }
}

diagnose();
