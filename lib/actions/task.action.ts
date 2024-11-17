"use server";

import Task from "@/database/models/task.model";
import { connectToDatabase } from "../mongoose";

export async function getAllTasks() {
  try {
    connectToDatabase();
    const tasks = await Task.find();
    return JSON.stringify(tasks);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteTaskById({ id }: { id: string }) {
  try {
    connectToDatabase(); // Assuming this function connects to your MongoDB database
    const deletedTask = await Task.findByIdAndDelete(id);
    if (deletedTask) {
      return JSON.stringify(deletedTask);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createTask(card: { title: string; column: string }) {
  try {
    connectToDatabase();
    await Task.create(card);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateTaskById(id: string, column: string) {
  try {
    connectToDatabase();
    await Task.findByIdAndUpdate(id, { column });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
