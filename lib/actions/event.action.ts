"use server";
import Event from "@/database/models/event.model";

import { connectToDatabase } from "../mongoose";

export async function getAllEvents() {
  try {
    connectToDatabase();
    const events = await Event.find();
    if (events) {
      return JSON.parse(JSON.stringify(events));
    }
  } catch (error) {
    console.log(error);
  }
}
