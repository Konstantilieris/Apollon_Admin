"use server";
import Event from "@/database/models/event.model";

import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Service from "@/database/models/service.model";
import Booking from "@/database/models/booking.model";
import Client from "@/database/models/client.model";
import { calculateDaysDifference } from "../utils";

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
  } catch (error) {
    console.log(error);
  }
}
export async function updateEvent({ event }: any) {
  try {
    connectToDatabase();
    await Event.findByIdAndUpdate(event._id, event);
  } catch (error) {
    console.log(error);
  }
}
export async function deleteEvent({ event }: any) {
  try {
    connectToDatabase();
    await Event.findByIdAndDelete(event._id);
  } catch (error) {
    console.log(error);
  }
}
export async function updateEventBookingOnlyTimeChange({ event }: any) {
  try {
    connectToDatabase();
    await Event.findByIdAndUpdate(event._id, event);
    if (event.isArrival) {
      await Booking.findByIdAndUpdate(event.Id, { fromDate: event.StartTime });
    } else {
      await Booking.findByIdAndUpdate(event.Id, { toDate: event.StartTime });
    }

    revalidatePath("/booking");
    revalidatePath(`/calendar`);
  } catch (error) {
    console.log(error);
  }
}
export async function updateBookingDateChange({ event, pairDate }: any) {
  let dayDif;
  let total;
  let bookingFee;
  const session = await mongoose.startSession();

  try {
    await connectToDatabase();

    session.startTransaction();

    const booking = await Booking.findById(event.Id).session(session);
    if (!booking) {
      throw new Error(`Booking not found for ID ${event.Id}`);
    }

    bookingFee = booking.client.bookingFee || 0;

    if (event.isArrival) {
      dayDif = calculateDaysDifference(event.StartTime, booking.fromDate, true);
    } else {
      dayDif = calculateDaysDifference(event.StartTime, booking.toDate, false);
    }

    total = Math.round(dayDif * bookingFee);

    if (event.isTransport) {
      const updateService = await Service.findOneAndUpdate(
        { bookingId: event.Id, serviceType: event.isTransport },
        { date: event.StartTime },
        { session }
      );
      if (!updateService) {
        throw new Error(
          `Service update failed for booking ${event.Id} and service type ${event.isTransport}`
        );
      }
    }

    await Client.findByIdAndUpdate(
      booking.client.clientId,
      { $inc: { owesTotal: total } },
      { session }
    );
    await Service.findOneAndUpdate(
      { bookingId: event.Id, serviceType: "ΔΙΑΜΟΝΗ" },
      { $inc: { amount: total } },
      { session }
    );

    const updateData = event.isArrival
      ? { fromDate: event.StartTime, $inc: { totalAmount: total } }
      : { toDate: event.StartTime, $inc: { totalAmount: total } };

    await Booking.findByIdAndUpdate(event.Id, updateData, { session });

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { StartTime: event.StartTime, EndTime: event.EndTime },
      { session }
    );

    if (!updatedEvent) {
      throw new Error(`Event update failed for ID ${event._id}`);
    }

    await session.commitTransaction();

    revalidatePath("/booking");
    revalidatePath(`/calendar`);
    revalidatePath(`/clients/${booking.client.clientId}`);
    return true;
  } catch (error) {
    console.error("Error in updateBookingDateChange:", error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
}
export async function updateAppointmentRoom({
  appointmentId,
  updatedDogsData,
}: {
  appointmentId: string;
  updatedDogsData: { dogId: string; roomId: string }[];
}) {
  try {
    // Find the appointment by ID and update the dogsData field
    await Event.findByIdAndUpdate(
      appointmentId,
      {
        $set: { dogsData: updatedDogsData }, // Update the dogsData with the new room for each dog
      },
      { new: true } // Return the updated document
    );
    return true;
  } catch (error) {
    console.error("Error updating room in appointment for dogs:", error);
    throw new Error("Failed to update room for the appointment.");
  }
}
