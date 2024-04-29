"use server";

import Room from "@/database/models/room.model";
import { connectToDatabase } from "../mongoose";
import Booking from "@/database/models/booking.model";
import Client from "@/database/models/client.model";
import { DateRange } from "react-day-picker";
import { revalidatePath } from "next/cache";

export async function createRooms(name: string, path: string) {
  try {
    connectToDatabase();

    const room = await Room.create({ name, price: 25 });
    if (room) {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(room));
    } // Return the created room
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllRooms() {
  try {
    connectToDatabase();
    const rooms = await Room.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(rooms));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getRoomById(roomId: any) {
  try {
    connectToDatabase();
    const room = await Room.findById(roomId);
    if (room) {
      return JSON.stringify(room);
    } // Return the found room
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateRoomById(roomId: any, name: string, path: string) {
  try {
    connectToDatabase();

    const room = await Room.findByIdAndUpdate(roomId, { name }, { new: true });
    if (room) {
      return JSON.parse(JSON.stringify(room));
    } // Return the updated room
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllRoomsAndBookings(rangeDate: DateRange) {
  try {
    connectToDatabase();
    const rooms = await Room.find().populate({
      path: "currentBookings",
      model: Booking,
      populate: {
        path: "clientId", // Populate the clientId field
        model: Client,
        select: "firstName lastName dog.name", // Select the required fields
      },
      match: {
        $or: [
          {
            $and: [
              { fromDate: { $lte: rangeDate.to } }, // Booking starts before or on rangeDate.toDate
              { toDate: { $gte: rangeDate.to } }, // Booking ends after or on rangeDate.toDate
            ],
          },
          {
            $and: [
              { fromDate: { $lte: rangeDate.from } }, // Booking starts before or on rangeDate.fromDate
              { toDate: { $gte: rangeDate.from } }, // Booking ends after or on rangeDate.fromDate
            ],
          },
          {
            $and: [
              { fromDate: { $gte: rangeDate.from } }, // Booking starts after or on rangeDate.fromDate
              { toDate: { $lte: rangeDate.to } }, // Booking ends before or on rangeDate.toDate
            ],
          },
        ],
      },
      options: { sort: { fromDate: 1 } },
    });
    return JSON.stringify(rooms);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteRoomById(roomId: any, path: string) {
  try {
    connectToDatabase();
    const room = await Room.findByIdAndDelete(roomId);
    if (room) {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(room));
    } // Return the deleted room
  } catch (error) {
    console.log(error);
    throw error;
  }
}
