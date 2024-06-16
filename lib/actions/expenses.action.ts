"use server";

import Expenses, { Categories } from "@/database/models/expenses.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function createExpense({
  amount,
  date,
  parentCategory,
  subCategory,
  description,
}: {
  amount: number;
  date: Date;
  parentCategory: any;
  subCategory: any;
  description: string | undefined;
}) {
  try {
    connectToDatabase();

    const newExpense = await Expenses.create({
      amount,
      date,
      description,
      category: {
        main: parentCategory._id,
        sub: subCategory._id,
      },
    });

    if (newExpense) {
      revalidatePath("/expenses");
      return JSON.parse(JSON.stringify(newExpense));
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
export async function getExpensesByCategories() {
  try {
    connectToDatabase();
    const expenses = await Expenses.find();

    return JSON.parse(JSON.stringify(expenses));
  } catch (error) {
    console.log(error);
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

export async function createMainCategories() {
  try {
    connectToDatabase();
    const mainCategories = [
      { name: "ΣΠΙΤΙ", img: "/assets/icons/home.svg" },
      { name: "ΣΚΥΛΟΙ", img: "/assets/icons/dog.svg" },
      { name: "ΛΟΓΙΣΤΙΚΑ", img: "/assets/icons/logistic.svg " },
      { name: "ΕΡΓΑΤΕΣ", img: "/assets/icons/worker.svg" },
      { name: "ΕΠΙΧΕΙΡΗΣΗ", img: "/assets/icons/bussiness.svg" },
      { name: "ΓΙΑΤΡΟΙ", img: "/assets/icons/doctor.svg" },
      { name: "ΑΥΤΟΚΙΝΗΤΑ", img: "/assets/icons/car.svg" },
    ];

    const categories = mainCategories.map((category) => {
      return Categories.create({
        name: category.name,
        img: category.img,
      });
    });
    return categories;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createSubCategory({
  name,
  icon,
  color,
  parentCategory,
}: {
  name: string;
  icon: string;
  color: string;
  parentCategory: any;
}) {
  try {
    connectToDatabase();
    const subCategory = await Categories.create({
      name,
      icon,
      color,
      parentCategory: parentCategory._id,
    });
    await Categories.findByIdAndUpdate(parentCategory._id, {
      $push: { subCategories: subCategory._id },
    });
    if (subCategory) {
      revalidatePath("/expenses");
      return JSON.parse(JSON.stringify(subCategory));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllCategories() {
  try {
    connectToDatabase();
    const categories = await Categories.find({ parentCategory: null }).populate(
      { path: "subCategories", model: "Categories", select: "name color icon" }
    );

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function totalFromEachMainCategory() {
  try {
    connectToDatabase();
    const totalAmountByCategory = await Expenses.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category.main",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category.name",

          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    return totalAmountByCategory;
  } catch (error) {
    console.error(
      "Error fetching total amount by category for current month:",
      error
    );
    throw error;
  }
}
export async function totalFromMainCategoryWithId({ id }: { id: string }) {
  try {
    connectToDatabase();
    if (!id) {
      const firstMainCategory = await Categories.findOne({
        parentCategory: null,
      });
      if (!firstMainCategory) {
        throw new Error("No main categories available.");
      }
      id = firstMainCategory._id;
    }
    const match = { "category.main": new mongoose.Types.ObjectId(id) };
    const totalAmountByCategory = await Expenses.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "categories",
          localField: "category.main",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category.name",

          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    return totalAmountByCategory;
  } catch (error) {
    console.error(
      "Error fetching total amount by category for current month:",
      error
    );
    throw error;
  }
}
export async function totalSumFromAllCategories() {
  try {
    connectToDatabase();
    const totalSumFromAllCategories = await Expenses.aggregate([
      {
        $group: {
          _id: "SumforThisMonth",
          totalSum: { $sum: "$amount" },
        },
      },
    ]);
    return totalSumFromAllCategories;
  } catch (error) {
    console.error(
      "Error fetching total amount by category for current month:",
      error
    );
    throw error;
  }
}
export async function getMainCategoriesWithExpenses({
  id,
  page,
  sub,
}: {
  id: string;
  page: number;
  sub: string;
}) {
  try {
    if (!id) {
      const firstMainCategory = await Categories.findOne({
        parentCategory: null,
      });
      if (!firstMainCategory) {
        throw new Error("No main categories available.");
      }
      id = firstMainCategory._id.toString();
    }

    const match: any = { "category.main": new mongoose.Types.ObjectId(id) };
    if (sub) {
      const subCategoryId = new mongoose.Types.ObjectId(sub);
      match["category.sub"] = subCategoryId;
    }
    const itemsPerPage = 4;
    const skipItems = (page - 1) * itemsPerPage;
    const totalCount = await Expenses.countDocuments(match);
    const pipeline: mongoose.PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "categories",
          localField: "category.main",
          foreignField: "_id",
          as: "mainCategoryDetails",
        },
      },
      { $unwind: "$mainCategoryDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "mainCategoryDetails._id",
          foreignField: "parentCategory",
          as: "mainCategoryDetails.subCategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category.sub",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
      { $unwind: "$subCategoryDetails" },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$mainCategoryDetails._id",
          mainCategory: { $first: "$mainCategoryDetails" },
          expenses: {
            $push: {
              _id: "$_id",
              amount: "$amount",
              date: "$date",
              description: "$description",
              category: {
                main: "$category.main",
                sub: "$subCategoryDetails",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          mainCategory: 1,
          expenses: {
            $slice: ["$expenses", skipItems, itemsPerPage],
          },
        },
      },
    ];

    const results = await Expenses.aggregate(pipeline);
    const hasNextPage = skipItems + itemsPerPage < totalCount;
    return {
      results: results.length ? JSON.parse(JSON.stringify(results)) : [],
      hasNextPage,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching main categories with expenses.");
  }
}
export async function getFirstMainCategory() {
  try {
    connectToDatabase();
    const category = await Categories.findOne({ parentCategory: null });
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
