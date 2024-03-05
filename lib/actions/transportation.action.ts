"use server";

import Transport from "@/database/models/transportation.model";
import { connectToDatabase } from "../mongoose";
import Client from "@/database/models/client.model";
import Appointment from "@/database/models/event.model";
import { revalidatePath } from "next/cache";
import { formatTime } from "../utils";

export async function CreateTransport({
  clientId,
  price,
  date,
  dogs,
  timeArrival,

  notes,
  path,
}: any) {
  try {
    connectToDatabase();
    const selectedDogsFiltered = dogs.map((item: any) => ({
      dogId: item._id,
      dogName: item.name,
    }));
    const transport = await Transport.create({
      clientId,
      price,
      date,
      dogs: selectedDogsFiltered,
      timeArrival,

      notes,
    });
    if (transport) {
      const serviceObject = {
        service: transport._id,
        amount: price,
        date: transport.createdAt,
        serviceType: "Transport",
      };
      const client = await Client.findOneAndUpdate(
        { _id: clientId }, // Find the client document by _id
        { $push: { owes: serviceObject } }, // Push the service object onto the owes array
        { new: true } // Return the updated document after the update operation
      );
      const startTime = new Date(date);
      const endTime = new Date(date);
      startTime.setHours(
        parseInt(timeArrival.split(":")[0], 10),
        parseInt(timeArrival.split(":")[1], 10)
      );

      endTime.setHours(
        parseInt(timeArrival.split(":")[0], 10),
        parseInt(timeArrival.split(":")[1], 10)
      );
      const appointmentDescription = `${
        client.location.address
      } - ${selectedDogsFiltered
        .map(({ dogName }: any) => `${dogName}`)
        .join(", ")} - Μεταφορά`;
      await Appointment.create({
        Id: transport._id, // Use the training _id as the event Id
        Type: "ΜΕΤΑΦΟΡΑ",
        Subject: `${client.lastName} - ΜΕΤΑΦΟΡΑ`,
        Description: appointmentDescription,
        StartTime: startTime,
        EndTime: endTime,
      });
      revalidatePath(path);
      return JSON.parse(JSON.stringify(transport));
    }
  } catch (error) {
    console.error("Error creating transportation:", error);
  }
}
export async function getAllTransports() {
  try {
    connectToDatabase();
    const transports = await Transport.find()
      .populate({
        path: "clientId",
        model: Client,
        select: "firstName lastName",
      })
      .sort({ date: 1 });
    return JSON.parse(JSON.stringify(transports));
  } catch (error) {
    console.error("Error getting all transports:", error);
  }
}
export async function editTransportDate(id: string, date: Date) {
  try {
    connectToDatabase();
    const updatedTransport = JSON.parse(
      JSON.stringify(
        await Transport.findOneAndUpdate({ _id: id }, { date }, { new: true })
      )
    );
    if (updatedTransport) {
      const appointment = JSON.parse(
        JSON.stringify(await Appointment.findOne({ Id: updatedTransport._id }))
      );
      if (appointment) {
        const startTime = new Date(date);
        const endTime = new Date(date);
        startTime.setHours(
          parseInt(appointment.StartTime.split("T")[1].split(":")[0], 10),
          parseInt(appointment.StartTime.split("T")[1].split(":")[1], 10)
        );
        endTime.setHours(
          parseInt(appointment.EndTime.split("T")[1].split(":")[0], 10),
          parseInt(appointment.EndTime.split("T")[1].split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(appointment._id, {
          StartTime: startTime,
          EndTime: endTime,
        });
      }
      return updatedTransport;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function editTransportArrival(
  id: string,
  timeArrival: Date | undefined
) {
  try {
    connectToDatabase();
    const updatedTransport = JSON.parse(
      JSON.stringify(
        await Transport.findOneAndUpdate(
          { _id: id },
          { timeArrival: formatTime(timeArrival, "el") },
          { new: true }
        )
      )
    );
    if (updatedTransport) {
      const appointment = JSON.parse(
        JSON.stringify(await Appointment.findOne({ Id: updatedTransport._id }))
      );
      if (appointment) {
        const startTime = new Date(updatedTransport.date);
        startTime.setHours(
          parseInt(formatTime(timeArrival, "el").split(":")[0], 10),
          parseInt(formatTime(timeArrival, "el").split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(appointment._id, {
          StartTime: startTime,
        });
      }
      return updatedTransport;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getTransportById(id: string) {
  try {
    connectToDatabase();
    const transport = await Transport.findById(id).populate({
      path: "clientId",
      model: Client,
      select: "firstName lastName",
    });
    if (transport) {
      return JSON.parse(JSON.stringify(transport));
    }
  } catch (error) {
    console.error("Error fetching transport:", error);
  }
}
