// lib/actions/training.action.ts
"use server";

import { CATEGORY, SERVICE_TYPE } from "@/constants";
import Appointment from "@/database/models/event.model";
import Service from "@/database/models/service.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { deleteSelectedServiceScheduler } from "./service.action";
import { connectToDatabase } from "@/lib/mongoose";
import Client from "@/database/models/client.model";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface CreateTrainingPayload {
  clientId: string;
  dogIds: string[];
  dogNames: string[];
  sessionType: typeof SERVICE_TYPE.TRAINING | typeof SERVICE_TYPE.DAILY_CARE;
  price: number;
  startTime: Date;
  durationHours: number; // 2 | 3 | …
  notes?: string;
}

/* ------------------------------------------------------------------ */
/* 1.  Δημιουργία                                                     */
/* ------------------------------------------------------------------ */
export async function createTrainingSession(payload: CreateTrainingPayload) {
  await connectToDatabase();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    /* 1️⃣  Service */
    const end = new Date(
      payload.startTime.getTime() + payload.durationHours * 3_600_000
    );

    const service = await Service.create(
      [
        {
          serviceType: payload.sessionType,
          clientId: payload.clientId,
          amount: payload.price,
          date: payload.startTime,
          endDate: end,
          notes: payload.notes,
          paid: false,
        },
      ],
      { session }
    );

    /* 2️⃣  Calendar block */
    const subject = `${payload.sessionType} - ${payload.dogNames.join(
      ", "
    )} - €${payload.price.toFixed(2)}`;

    await Appointment.create(
      [
        {
          Id: service[0]._id, // <— note the array syntax above
          Subject: subject,
          Description: payload.notes ?? "",
          Type: payload.sessionType,
          StartTime: payload.startTime,
          EndTime: end,
          categoryId:
            payload.sessionType === SERVICE_TYPE.TRAINING
              ? CATEGORY.TRAINING
              : CATEGORY.DAILY_CARE,
          clientId: payload.clientId,
          dogsData: payload.dogIds.map((id) => ({ dogId: id })),
          Color:
            payload.sessionType === SERVICE_TYPE.TRAINING
              ? "#ea580c"
              : "#f59e0b",
        },
      ],
      { session }
    );

    /* 3️⃣  Update client’s financials */
    await Client.findByIdAndUpdate(
      payload.clientId,
      {
        $inc: { owesTotal: payload.price },
      },
      { session }
    );

    await session.commitTransaction();
    const serializedService = JSON.parse(JSON.stringify(service[0]._id));
    return { ok: true, serviceId: serializedService };
  } catch (err) {
    await session.abortTransaction();
    console.error("createTrainingSession error:", err);
    throw err;
  } finally {
    session.endSession();
    revalidatePath("/dashboard/calendar");
  }
}

/* ------------------------------------------------------------------ */
/* 2.  Drag-update ημερομηνιών                                        */
/* ------------------------------------------------------------------ */
export async function updateTrainingSessionDates(
  serviceId: string,
  newStart: Date
) {
  await connectToDatabase();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const service = await Service.findById(serviceId).session(session);
    if (!service) throw new Error("Service not found");

    const duration = service.endDate.getTime() - service.date.getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    service.date = newStart;
    service.endDate = newEnd;
    await service.save({ session });

    await Appointment.updateOne(
      { Id: serviceId },
      { StartTime: newStart, EndTime: newEnd },
      { session }
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    console.error("updateTrainingSessionDates error:", err);
    throw err;
  } finally {
    session.endSession();
    revalidatePath("/dashboard/calendar");
  }
}

/* ------------------------------------------------------------------ */
/* 3.  Οριστική διαγραφή                                              */
/* ------------------------------------------------------------------ */
export async function deleteTrainingSession(serviceId: string, path: string) {
  await connectToDatabase();

  try {
    const service =
      await Service.findById(serviceId).populate("clientId bookingId");
    console.log("deleteTrainingSession service:", service);
    if (!service) throw new Error("Service not found");

    /* ⬇️ ανακύκλωση existing βαρύ workflow (χειρίζεται οικονομικά, owes κ.λπ.) */
    await deleteSelectedServiceScheduler({ service, path });

    /* ⬇️ καθάρισε το Calendar */
    await Appointment.deleteOne({ Id: serviceId });

    revalidatePath(path);
  } catch (err) {
    console.error("deleteTrainingSession error:", err);
    throw err;
  }
}
