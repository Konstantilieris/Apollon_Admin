"use server";

import AdminModel from "@/database/models/admin.model";
import { connectToDatabase } from "../mongoose";

interface getAdminParams {
  name: string;
  password: string;
  role: string;
}
export async function createAdmin(params: getAdminParams) {
  const { name, password, role } = params;
  try {
    connectToDatabase();
    const existingAdmin = await AdminModel.findOne({ name });
    if (existingAdmin) {
      console.log("Admin already created");
      return { user: existingAdmin.name };
    }
    const user = await AdminModel.create({ name, password, role });
    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
