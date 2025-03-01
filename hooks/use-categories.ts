"use client";
import { useState, useEffect, useCallback } from "react";
import { getAllCategories } from "@/lib/actions/expenses.action";

type Category = {
  _id: string;
  name: string;
};

let cachedCategories: Category[] | null = null;

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    cachedCategories || []
  );

  const refreshCategories = useCallback(async () => {
    try {
      const res = await getAllCategories();
      cachedCategories = res;
      setCategories(res);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    if (!cachedCategories) {
      refreshCategories();
    }
  }, [refreshCategories]);

  return { categories, refreshCategories };
}
