"use server";

import { db } from "@/db";
import { expenses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const data = await db.query.expenses.findMany({
        where: eq(expenses.userId, userId),
        orderBy: [desc(expenses.date)],
    });

    return data.map(expense => ({
        ...expense,
        amount: parseFloat(expense.amount),
    }));
}

export async function addExpense(data: {
    description: string;
    amount: string;
    category: string;
}) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    await db.insert(expenses).values({
        userId,
        description: data.description,
        amount: data.amount,
        category: data.category,
    });

    revalidatePath("/");
}

export async function deleteExpense(id: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    await db.delete(expenses).where(
        and(
            eq(expenses.id, id),
            eq(expenses.userId, userId)
        )
    );

    revalidatePath("/");
}
