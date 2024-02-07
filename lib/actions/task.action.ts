"use server";

import Task from "@/database/models/task.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import { updateTaskProps } from "@/types";
interface CreateTaskProps {
  title: string;
  description: string;
  priority: number;
  path: string;
}
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
export async function CreateTask({
  title,
  description,
  priority,
  path,
}: CreateTaskProps) {
  try {
    connectToDatabase();
    const newTask = await Task.create({
      title,
      description,
      priority,
      status: "Pending",
    });

    if (newTask) {
      revalidatePath(path);

      return JSON.stringify(newTask);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getPendingTasks() {
  try {
    connectToDatabase();
    const pendingTasks = await Task.find({ status: "Pending" });
    return JSON.stringify(pendingTasks);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getCompletedTasks() {
  try {
    connectToDatabase();
    const completedTasks = await Task.find({ status: "Completed" });
    return JSON.stringify(completedTasks);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateTask({ id, path }: updateTaskProps) {
  try {
    await connectToDatabase();

    // Assuming "status" is a field in your Task model that you want to update
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: { status: "Completed" } }, // Update the status to 'Completed'
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      throw new Error("Task not found");
    }
    revalidatePath(path);
    return JSON.stringify(updatedTask);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteTaskById({ id, path }: any) {
  try {
    connectToDatabase(); // Assuming this function connects to your MongoDB database
    const deletedTask = await Task.findByIdAndDelete(id);
    if (deletedTask) {
      revalidatePath(path);

      return JSON.stringify(deletedTask);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
