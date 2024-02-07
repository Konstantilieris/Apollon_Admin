/* eslint-disable camelcase */
"use server";

import { connectToDatabase } from "../mongoose";
import Booking from "@/database/models/booking.model";

import { getDatesInRange } from "../utils";

import Room from "@/database/models/room.model";
import { revalidatePath } from "next/cache";
import Client from "@/database/models/client.model";

interface ICreateBooking {
  roomId: string;
  clientId_string: string;
  rangeDate: { from: Date; to: Date };
  totalprice: Number | undefined;
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
      timeArrival,
      timeDeparture,
    });
    try {
      await Room.findByIdAndUpdate(
        { _id: roomId },
        { $push: { currentBookings: booking._id } }
      );
    } catch (error) {
      console.error("Error updating room:", error);
      // Handle the error as needed
    }
    if (booking) {
      const serviceObject = {
        service: booking._id,
        amount: totalprice,
        date: booking.createdAt,
        serviceType: "Booking",
      };
      await Client.findOneAndUpdate(
        { _id: booking.clientId }, // Find the client document by _id
        { $push: { owes: serviceObject } }, // Push the service object onto the owes array
        { new: true } // Return the updated document after the update operation
      );
    }
    revalidatePath(path);
    if (booking) return JSON.stringify(booking);
  } catch (error) {
    console.log("Failed to create booking", error);
    throw error;
  }
}
export async function getBookingById(bookingId: string) {
  try {
    connectToDatabase();
    const booking = await Booking.findById(bookingId).populate([
      {
        path: "clientId",
        model: Client,
        select: "firstName lastName dog.name",
      },
      { path: "roomId", model: Room, select: "name" },
    ]);

    if (!booking) {
      throw new Error("Booking not found");
    }

    return JSON.stringify(booking);
  } catch (error) {
    console.error("Failed to retrieve booking:", error);
    throw error;
  }
}
