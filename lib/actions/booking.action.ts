/* eslint-disable camelcase */
"use server";

import { connectToDatabase } from "../mongoose";
import Booking from "@/database/models/booking.model";

import { getDatesInRange } from "../utils";

import Room from "@/database/models/room.model";
import { revalidatePath } from "next/cache";

interface ICreateBooking {
  roomId: string;
  clientId_string: string;
  rangeDate: { from: Date; to: Date };
  totalprice: number | undefined;
  path: string;
  timeArrival: string;
  timeDeparture: string;
}

export async function CreateBooking({
  clientId_string,
  rangeDate,
  roomId,
  totalprice,
  path,
  timeArrival,
  timeDeparture,
}: ICreateBooking) {
  try {
    connectToDatabase();
    const totalDays = getDatesInRange(rangeDate.from, rangeDate.to);

    // eslint-disable-next-line no-unused-vars
    const booking = await Booking.create({
      roomId,
      clientId: clientId_string,
      fromDate: rangeDate.from,
      toDate: rangeDate.to,
      totalDays: totalDays?.length,
      totalAmount: totalprice,
    });
    try {
      const updateObject: { $push?: { [key: string]: any } } = {};

      if (booking) {
        updateObject.$push = {
          currentBookings: booking._id,
        };
      }

      if (totalDays && totalDays.length > 0) {
        const formattedDates = totalDays.map(
          (day) => new Date(day).toISOString().split("T")[0]
        );

        if (!updateObject.$push) {
          updateObject.$push = {};
        }

        updateObject.$push = {
          ...updateObject.$push,
          currentBookings: booking._id,
          unavailableDates: { $each: formattedDates },
        };
      }

      if (Object.keys(updateObject).length > 0) {
        await Room.findByIdAndUpdate({ _id: roomId }, updateObject);
      }
    } catch (error) {
      console.error("Error updating room:", error);
      // Handle the error as needed
    }
    revalidatePath(path);
    if (booking) return JSON.stringify(booking);
  } catch (error) {
    console.log("Failed to create booking", error);
    throw error;
  }
}
