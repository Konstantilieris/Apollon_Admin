"use server";

import Expenses, { Categories } from "@/database/models/expenses.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

import { Key } from "react";
import FinancialSummary from "@/database/models/financial.model";
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
export async function updateCategory(id: Key, categoryData: any) {
  await connectToDatabase();
  try {
    const category = await Categories.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    Object.assign(category, categoryData);
    await category.save();
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
export async function deleteCategory(id: Key) {
  await connectToDatabase();
  try {
    const category = await Categories.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await category.deleteOne();
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
export async function getFinancialSummary() {
  await connectToDatabase();
  try {
    const financial = await FinancialSummary.find();
    if (!financial || !financial[0]?.totalExpenses) {
      return 0;
    }
    return JSON.parse(JSON.stringify(financial[0].totalExpenses));
  } catch (error) {}
}
export interface ExpensesQuery {
  page?: number; // 1‑based
  limit?: number; // rows per page
  query?: string; // search by category (you can enrich later)
  status?: "all" | "pending" | "paid" | "overdue";
  paymentMethod?: "all" | "creditcard" | "cash" | "bank";
  date?: "all" | "last7Days" | "last30Days" | "last60Days";
  sort?: string; // column uid
  direction?: "asc" | "desc";
}

export async function getAllExpenses() {
  await connectToDatabase();
  try {
    const expenses = await Expenses.find().populate("category", "name");
    return JSON.parse(JSON.stringify(expenses));
  } catch (error) {
    console.error(error);
  }
}
export async function getExpenses(params: ExpensesQuery) {
  await connectToDatabase();
  const {
    query,
    status = "all",
    paymentMethod = "all",
    date = "all",
    sort = "date",
    direction = "desc",
  } = params;

  /* coerce paging params – fall back to sane defaults */
  const page = Number(params.page) || 1; // 1‑based
  const limit = Number(params.limit) || 10; // rows per page

  /* ---------------- base $match (cheap fields) ---------------- */
  const match: any = {};
  if (status !== "all") match.status = status;
  if (paymentMethod !== "all") match.paymentMethod = paymentMethod;

  if (date !== "all") {
    const days = Number(date.match(/\d+/)?.[0] ?? 0);
    match.date = { $gte: new Date(Date.now() - days * 86_400_000) };
  }

  /* --------------------- base pipeline ----------------------- */
  const pipeline: any[] = [
    { $match: match },

    /* join category */
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    /* join vendor (optional) */
   
  ];

  /* ------------------- text search filter -------------------- */
  if (query) {
    pipeline.push({
      $match: { "category.name": { $regex: query, $options: "i" } },
    });
  }

  /* ------------------------ sorting -------------------------- */
  const sortMap: Record<string, string> = {
    date: "date",
    totalAmount: "totalAmount",
    amount: "amount",
    taxAmount: "taxAmount",
    category: "category.name",
    vendor: "vendor.name",
  };
  const sortKey = sortMap[sort] ?? "date";
  pipeline.push({ $sort: { [sortKey]: direction === "asc" ? 1 : -1 } });

  /* ---------------------- pagination ------------------------- */
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip }, { $limit: limit });

  /* ------------- project to UI‑friendly structure ------------ */
  pipeline.push({
    $project: {
      _id: 1,
      date: 1,
      amount: 1,
      taxAmount: 1,
      totalAmount: 1,
      paymentMethod: 1,
      status: 1,
      notes: 1,
      "category.name": 1,
      "vendor.name": 1,
      "vendor.contactInfo": 1,
      "vendor.serviceType": 1,
    },
  });

  /* ------------------- execute & prepare --------------------- */
  const docs = await Expenses.aggregate(pipeline);
  const data = JSON.parse(JSON.stringify(docs));

  /* total for THIS page only */
  const pageTotal = data.reduce(
    (sum: number, d: { totalAmount?: number }) => sum + (d.totalAmount ?? 0),
    0
  );

  /* total row‑count (all pages) — cheap because it reuses the pre‑$skip pipeline */
  const [{ count = 0 } = {}] = await Expenses.aggregate([
    ...pipeline.slice(
      0,
      pipeline.findIndex((s) => "$skip" in s)
    ),
    { $count: "count" },
  ]);

  return {
    data,
    totalPages: Math.max(1, Math.ceil(count / limit)),
    totalAmount: pageTotal, // sum of the limited rows on the current page
  };
}
