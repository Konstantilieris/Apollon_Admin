"use server";

import { connectToDatabase } from "../mongoose";
import Constant from "@/database/models/constants.model";

interface CreateConstantProps {
  type: string;
  value: string;
  path: string;
}

export async function pushValueOnConstant({
  type,
  value,
  path,
}: CreateConstantProps) {
  try {
    connectToDatabase();
    const category = await Constant.findOneAndUpdate(
      { type },
      { $push: { value } },
      { new: true }
    );

    if (category) return JSON.stringify(category);
  } catch (error) {
    console.log(error);
  }
}
export async function getConstant(type: string) {
  try {
    connectToDatabase();
    const category = await Constant.findOne(
      {
        type,
      },
      {},
      { value: -1 }
    );
    if (category) return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.log(error);
  }
}
