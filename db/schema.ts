import { pgTable, uuid, text, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    date: timestamp('date').defaultNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
