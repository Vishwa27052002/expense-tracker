"use client";

import { useState, useEffect, useTransition } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { Expense } from "../types/expense";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getExpenses, addExpense as dbAddExpense, deleteExpense as dbDeleteExpense } from "./actions";

export default function Home() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchExpenses();
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  const addExpense = async (newExpense: Omit<Expense, "id">) => {
    startTransition(async () => {
      try {
        await dbAddExpense({
          description: newExpense.description,
          amount: newExpense.amount.toString(),
          category: newExpense.category,
        });
        await fetchExpenses();
      } catch (error) {
        console.error("Failed to add expense:", error);
      }
    });
  };

  const deleteExpense = async (id: string) => {
    startTransition(async () => {
      try {
        await dbDeleteExpense(id);
        await fetchExpenses();
      } catch (error) {
        console.error("Failed to delete expense:", error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12 flex flex-col items-center">
          <div className="w-full flex justify-end mb-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm font-medium">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
            Expense Tracker
          </h1>
          <p className="text-white/60 text-lg">Manage your finances with style.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <ExpenseForm onAddExpense={addExpense} />
          </div>
          <div className="lg:col-span-3">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        </div>
      </div>
    </main>
  );
}
