"use server";
import Event from "@/database/models/event.model";

import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

type eventProps = {
  event: {
    Id: any;
    Subject: string;
    Description?: string;
    StartTime: Date;
    Type: string;
    EndTime: Date;
    isReadonly?: boolean;
    RecurrenceRule?: string;
    Color?: string;
    Location?: string;
  };
};
export async function getAllEvents() {
  try {
    await connectToDatabase();
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
    await connectToDatabase();
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
export async function createEvent({ event }: eventProps) {
  try {
    connectToDatabase();

    await Event.create(event);

    revalidatePath("/calendar");
  } catch (error) {
    console.log(error);
  }
}
export async function updateEvent({ event }: any) {
  try {
    connectToDatabase();
    await Event.findByIdAndUpdate(event._id, event);
    revalidatePath("/calendar");
  } catch (error) {
    console.log(error);
  }
}
export async function deleteEvent({ event }: any) {
  try {
    connectToDatabase();
    await Event.findByIdAndDelete(event._id);
    revalidatePath("/calendar");
  } catch (error) {
    console.log(error);
  }
}
