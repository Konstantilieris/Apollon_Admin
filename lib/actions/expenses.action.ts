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
export async function updateExpense(id: Key, expense: any) {
  await connectToDatabase();
  try {
    await Expenses.findByIdAndUpdate(id, expense);
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
    await Expenses.findByIdAndDelete(id);
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
      await Expenses.findByIdAndDelete(id);
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
