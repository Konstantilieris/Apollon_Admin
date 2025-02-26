"use server";

import Expenses, { Categories } from "@/database/models/expenses.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

import { Key } from "react";
// ─────────────────────────────────────────────────────────────────────────────
// GET ALL CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export async function getAllCategories() {
  await connectToDatabase();
  try {
    const categories = await Categories.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {}
}
// ─────────────────────────────────────────────────────────────────────────────
// GET EXPENSE BY ID
// ─────────────────────────────────────────────────────────────────────────────
export async function getExpenseById(id: Key) {
  if (!id) return;
  await connectToDatabase();
  try {
    const expense = await Expenses.findById(id);
    return JSON.parse(JSON.stringify(expense));
  } catch (error) {
    console.error(error);
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// CREATE EXPENSE
// ─────────────────────────────────────────────────────────────────────────────
export async function createExpense(expense: any) {
  await connectToDatabase();
  try {
    console.log("Creating expense", expense);
    const newExpense = new Expenses(expense);
    await newExpense.save();
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// UPDATE EXPENSE
// ─────────────────────────────────────────────────────────────────────────────
export async function updateExpense(id: Key, expenseData: any) {
  await connectToDatabase();

  try {
    // 1) Find the existing doc
    const expense = await Expenses.findById(id);
    if (!expense) {
      throw new Error("Expense not found");
    }

    // 2) Update the fields
    //    You can map field-by-field or just Object.assign
    Object.assign(expense, expenseData);

    // 3) Save the doc => triggers pre/post save hooks
    await expense.save();

    // Revalidate if needed
    revalidatePath("/expenses");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// DELETE ONE EXPENSE
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteExpense(id: Key) {
  await connectToDatabase();
  try {
    // 1. Load the doc
    const expense = await Expenses.findById(id);
    if (!expense) {
      // No doc found, handle error or just return
      throw new Error("Expense not found");
    }

    // 2. Delete on the doc => triggers doc-level `pre('deleteOne')`
    await expense.deleteOne();

    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// DELETE MULTIPLE EXPENSES
//    - Loops over each ID and calls findByIdAndDelete()
//    - Each delete triggers the pre('findOneAndDelete') hook in your schema
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteMultipleExpenses(ids: Key[]) {
  await connectToDatabase();
  try {
    // Delete each expense individually so each triggers the Mongoose middleware
    for (const id of ids) {
      const expense = await Expenses.findById(id);
      if (expense) {
        await expense.deleteOne(); // doc-level delete => triggers the hook
      }
    }
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// GET ALL EXPENSES
// ─────────────────────────────────────────────────────────────────────────────
export async function getAllExpenses() {
  await connectToDatabase();
  try {
    const expenses = await Expenses.find().populate("category", "name");
    return JSON.parse(JSON.stringify(expenses));
  } catch (error) {
    console.error(error);
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// CREATE CATEGORY
// ─────────────────────────────────────────────────────────────────────────────
export async function createCategory(category: any) {
  await connectToDatabase();
  try {
    const newCategory = new Categories(category);
    await newCategory.save();
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
