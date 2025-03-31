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
export async function updateConstantsValue({ type, oldValue, newValue }: any) {
  try {
    await connectToDatabase();

    // Step 1: Remove the old value
    await Constant.updateOne({ type }, { $pull: { value: oldValue } });

    // Step 2: Add the new value, ensuring no duplicates
    const category = await Constant.findOneAndUpdate(
      { type },
      { $addToSet: { value: newValue } },
      { new: true }
    );

    if (category) return JSON.stringify(category);
  } catch (error) {
    console.error(error);
  }
}
export async function deleteConstantValue(type: string, value: string) {
  try {
    connectToDatabase();
    const category = await Constant.findOneAndUpdate(
      { type },
      { $pull: { value } },
      { new: true }
    );
    console.log("category", category);
    if (category) return JSON.stringify(category);
  } catch (error) {
    console.log(error);
  }
}
