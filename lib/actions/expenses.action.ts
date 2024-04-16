"use server";

import Expenses, { Categories } from "@/database/models/expenses.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function getAllCategories() {
  try {
    connectToDatabase();
    const categories = await Categories.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createExpense({
  amount,
  date,
  category,
  description,
  path,
}: {
  amount: number;
  date: Date;
  category: any;
  description: string | undefined;
  path: string;
}) {
  try {
    connectToDatabase();
    let categoryObject;
    const categoryExists = await Categories.find({ name: category.name });
    if (categoryExists.length === 0) {
      categoryObject = await Categories.create({
        name: category.name,
        color: category.color,
      });
    } else {
      categoryObject = categoryExists[0];
    }
    const newExpense = await Expenses.create({
      amount,
      date,
      category: categoryObject._id,
      description,
      path,
    });

    if (newExpense) {
      revalidatePath(path);
      return JSON.stringify(newExpense);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getExpenses() {
  try {
    connectToDatabase();
    const expenses = await Expenses.find();
    console.log(expenses);
  } catch (error) {
    console.log(error);
  }
}
export async function getExpensesByCategories({
  categoryName,
  filter,
  description,
  page = 1,
  pageSize = 3,
}: any) {
  try {
    connectToDatabase();
    const skipAmount = (page - 1) * pageSize;
    let sortOptions: 1 | -1;
    if (filter === "newest") {
      sortOptions = -1;
    } else if (filter === "oldest") {
      sortOptions = 1;
    } else {
      sortOptions = -1;
    }
    const expensesByCategories = await Expenses.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          "category.name": { $regex: categoryName || "", $options: "i" },
        },
      },
      {
        $match: {
          description: { $regex: description || "", $options: "i" },
        },
      },
      {
        $sort: {
          date: sortOptions,
        },
      },
      {
        $skip: skipAmount,
      },
      {
        $limit: pageSize,
      },
      {
        $group: {
          _id: "$category.name",
          expenses: { $push: "$$ROOT" },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalExpenses = await Expenses.countDocuments({
      category: {
        $in: await Categories.find({
          name: { $regex: categoryName || "", $options: "i" },
        }).select("_id"),
      },
    });

    const isNext = totalExpenses > skipAmount + expensesByCategories.length;
    return { expensesByCategories, isNext };
  } catch (error) {
    console.error("Error fetching expenses by categories:", error);
    throw error;
  }
}
export async function getTotalAmountByCategoryForCurrentMonth({
  categoryName,
}: any) {
  try {
    connectToDatabase();

    // Get the current date
    const currentDate = new Date();
    // Get the first day of the current month
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    // Get the last day of the current month
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Match expenses within the current month
    const totalAmountByCategory = await Expenses.aggregate([
      {
        $match: {
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, // Filter by current month
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          "category.name": { $regex: categoryName || "", $options: "i" }, // Filter by category name
        },
      },
      {
        $group: {
          _id: "$category.name",
          color: { $first: "$category.color" },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalSumFromAllCategories = await Expenses.aggregate([
      {
        $match: {
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, // Filter by current month
        },
      },
      {
        $group: {
          _id: "SumforThisMonth",
          totalSum: { $sum: "$amount" },
        },
      },
    ]);
    return { totalAmountByCategory, totalSumFromAllCategories };
  } catch (error) {
    console.error(
      "Error fetching total amount by category for current month:",
      error
    );
    throw error;
  }
}
export async function deleteExpense({
  id,
  path,
}: {
  id: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const deletedExpense = await Expenses.findByIdAndDelete(id);
    if (deletedExpense) {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(deletedExpense));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
