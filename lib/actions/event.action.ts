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
    // we need to fetch for each event the services with the same bookingId and see if they are paid maybe with aggregation
    const eventsWithPaidField = await Event.aggregate([
      {
        $lookup: {
          from: "services", // The services collection
          localField: "bookingId", // Event ID (Id field in your model)
          foreignField: "bookingId", // Booking ID in the services collection
          as: "relatedServices",
        },
      },
      {
        $addFields: {
          paid: {
            $cond: {
              if: { $eq: [{ $size: "$relatedServices" }, 0] }, // No related services
              then: false, // Mark as unpaid if no related services
              else: {
                $allElementsTrue: "$relatedServices.paid", // True if all related services are paid
              },
            },
          },
        },
      },
      {
        $project: {
          relatedServices: 0, // Exclude related services if not needed in the output
        },
      },
    ]);

    return JSON.parse(JSON.stringify(eventsWithPaidField));
  } catch (error) {
    console.log(error);
  }
}
export async function getEventsInRange({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  await connectToDatabase();
  const startDate = new Date(start);
  let endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn("getEventsInRange » bad dates", { start, end });
    return []; // nothing is better than a CastError
  }
  if (startDate.getTime() === endDate.getTime()) {
    // make the window [start, start + 1 day)
    endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
  }
  // everything that *overlaps* the visible window
  const pipeline = [
    {
      $match: {
        StartTime: { $lte: endDate },
        EndTime: { $gte: startDate },
      },
    },
    {
      $lookup: {
        from: "services",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "relatedServices",
      },
    },
    {
      $addFields: {
        paid: {
          $cond: [
            { $eq: [{ $size: "$relatedServices" }, 0] },
            false,
            { $allElementsTrue: "$relatedServices.paid" },
          ],
        },
      },
    },
    { $project: { relatedServices: 0 } },
  ];

  const events = await Event.aggregate(pipeline);
  console.log("________________EVENTS IN RANGE________________");
  console.log(events);
  return JSON.parse(JSON.stringify(events));
}
export async function getEventsWithPairs(startISO: string, endISO: string) {
  await connectToDatabase();

  const startDate = new Date(startISO);
  let endDate = new Date(endISO);
  if (startDate.getTime() === endDate.getTime()) {
    endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1_000);
  }

  /* ---------- first wave : everything that overlaps [start, end] ---------- */
  const baseStages = [
    {
      $lookup: {
        from: "services",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "relatedServices",
      },
    },
    {
      $addFields: {
        paid: {
          $cond: [
            { $eq: [{ $size: "$relatedServices" }, 0] },
            false,
            { $allElementsTrue: "$relatedServices.paid" },
          ],
        },
      },
    },
    { $project: { relatedServices: 0 } },
  ];

  const inRange = await Event.aggregate([
    {
      $match: {
        StartTime: { $lte: endDate },
        EndTime: { $gte: startDate },
      },
    },
    ...baseStages,
  ]);

  /* ---------- second wave : fetch whichever mates are missing ---------- */
  const bookings = Array.from(
    new Set(
      inRange.filter((e) => e.bookingId).map((e) => e.bookingId.toString())
    )
  );
  if (!bookings.length) return inRange;

  const seen = new Set(inRange.map((e) => e._id.toString()));

  const partners = await Event.aggregate([
    {
      $match: {
        bookingId: {
          $in: bookings.map((id) => new mongoose.Types.ObjectId(id)),
        },
        _id: {
          $nin: Array.from(seen).map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    ...baseStages,
  ]);

  return JSON.stringify([...inRange, ...partners]);
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
  } catch (error) {
    console.log(error);
  }
}
export async function updateBookingDateChange({ event, pairDate }: any) {
  const session = await mongoose.startSession();

  try {
    await connectToDatabase();
    session.startTransaction();

    // 1) Load the booking
    const booking = await Booking.findById(event.Id).session(session);
    if (!booking) {
      throw new Error(`Booking not found for ID ${event.Id}`);
    }

    // 2) Calculate how many days difference => how much we add to "amount"
    const bookingFee = booking.client.bookingFee || 0;
    let dayDif;
    if (event.isArrival) {
      // Shift fromDate
      dayDif = calculateDaysDifference(event.StartTime, booking.fromDate, true);
    } else {
      // Shift toDate
      dayDif = calculateDaysDifference(event.StartTime, booking.toDate, false);
    }
    const total = Math.round(dayDif * bookingFee);

    // 3) If event is a Pet Taxi, update the existing taxi Service doc-based
    if (event.isTransport) {
      const taxiService = await Service.findOne({
        bookingId: event.Id,
        serviceType: event.isTransport, // e.g. "Pet Taxi (Pick-Up)"
      }).session(session);

      if (!taxiService) {
        throw new Error(
          `Service update failed (not found) for booking ${event.Id}, service type ${event.isTransport}`
        );
      }

      // doc-based approach => triggers pre("save")
      taxiService.date = event.StartTime;
      // If you also want to adjust amount or anything else, do so:
      // taxiService.amount += ...
      await taxiService.save({ session });
    }

    // 4) Update the Client owesTotal with partial update if you want
    // (unless you also have complicated client-based middleware)
    await Client.findByIdAndUpdate(
      booking.client.clientId,
      { $inc: { owesTotal: total } },
      { session }
    );

    // 5) Doc-based update the Boarding (ΔΙΑΜΟΝΗ) Service
    //    So the `pre("save")` hook recalculates totalAmount, remainingAmount, etc.
    const boardingService = await Service.findOne({
      bookingId: event.Id,
      serviceType: "ΔΙΑΜΟΝΗ",
    }).session(session);

    if (!boardingService) {
      throw new Error(`Boarding service not found for booking ${event.Id}`);
    }

    // Increase the amount by "total" - Let the schema recalc tax, etc.
    boardingService.amount += total;
    if (event.isArrival) {
      boardingService.date = event.StartTime;
    } else {
      boardingService.endDate = event.StartTime; // Update the date to the new one
    } // Update the date to the new one
    // If you do NOT want leftover discount or partial payment messing it up:
    // boardingService.discount = 0; // if you want no discount
    // boardingService.paidAmount = 0; // if you want to reset partial payments

    // doc-based save => triggers pre("save") => recalculates totalAmount, remainingAmount
    await boardingService.save({ session });

    // 6) Update the Booking
    //    If you only want to shift fromDate or toDate, plus increment totalAmount:
    const updateData = event.isArrival
      ? { fromDate: event.StartTime, $inc: { totalAmount: total } }
      : { toDate: event.StartTime, $inc: { totalAmount: total } };

    await Booking.findByIdAndUpdate(event.Id, updateData, { session });

    // 7) Update the Event times
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { StartTime: event.StartTime, EndTime: event.EndTime },
      { session }
    );
    if (!updatedEvent) {
      throw new Error(`Event update failed for ID ${event._id}`);
    }

    // 8) Commit + revalidate
    await session.commitTransaction();
    session.endSession();
    console.log("Booking date change updated successfully.");
    revalidatePath("/booking");
    revalidatePath(`/client/${booking.client.clientId}`);
    return true;
  } catch (error) {
    console.error("Error in updateBookingDateChange:", error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
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
