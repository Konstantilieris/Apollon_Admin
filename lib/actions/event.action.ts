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

export async function getEventsByDate({ date }: { date: Date }) {
  try {
    connectToDatabase();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const events = await Event.find({
      StartTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ StartTime: 1 });
    if (events) {
      return JSON.parse(JSON.stringify(events));
    }
  } catch (error) {
    console.log(error);
  }
}
