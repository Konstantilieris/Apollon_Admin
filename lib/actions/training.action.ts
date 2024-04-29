"use server";

import Training from "@/database/models/training.model";
import { connectToDatabase } from "../mongoose";
import Client from "@/database/models/client.model";
import { revalidatePath } from "next/cache";
import { CreateTrainingParams } from "@/types";
import Appointment from "@/database/models/event.model";

import { formatTime } from "../utils";
import Service from "@/database/models/service.model";

export async function CreateTraining({
  name,
  clientId,
  price,
  date,
  dogs,
  timeArrival,
  timeDeparture,
  notes,
  path,
}: CreateTrainingParams) {
  try {
    connectToDatabase();
    const selectedDogsFiltered = dogs.map((item: any) => ({
      dogId: item._id,
      dogName: item.name,
    }));
    const training = await Training.create({
      name,
      clientId,
      price,
      date,
      dogs: selectedDogsFiltered,
      timeArrival,
      timeDeparture,
      notes,
    });
    if (training) {
      const service = await Service.create({
        serviceType: "ΕΚΠΑΙΔΕΥΣΗ",
        clientId,
        amount: +price,
        date,
      });
      if (service) {
        const client = await Client.findByIdAndUpdate(
          clientId,
          { $push: { owes: service._id } },
          { new: true }
        );
        if (client) {
          const startTime = new Date(date);
          const endTime = new Date(date);
          startTime.setHours(
            parseInt(timeArrival.split(":")[0], 10),
            parseInt(timeArrival.split(":")[1], 10)
          );

          endTime.setHours(
            parseInt(timeDeparture.split(":")[0], 10),
            parseInt(timeDeparture.split(":")[1], 10)
          );

          const appointmentDescription = selectedDogsFiltered
            .map(({ dogName }: any) => `${dogName} - ΕΚΠΑΙΔΕΥΣΗ`)
            .join(", ");

          await Appointment.create({
            Id: training._id, // Use the training _id as the event Id
            Type: "Training",
            Subject: `${client?.lastName} - ΕΚΠΑΙΔΕΥΣΗ`,
            Description: appointmentDescription,
            StartTime: startTime,
            EndTime: endTime,
          });

          revalidatePath(path);
          return JSON.parse(JSON.stringify(training));
        } else {
          throw new Error("Client not found");
        }
      }
    }
  } catch (error) {
    console.error("Error creating training:", error);
  }
}
export async function getAllTrainings() {
  try {
    connectToDatabase();
    const trainings = await Training.find()
      .populate({
        path: "clientId",
        model: Client,
        select: "firstName lastName",
      })
      .sort({ date: 1 });
    return JSON.parse(JSON.stringify(trainings));
  } catch (error) {
    console.error("Error fetching trainings:", error);
  }
}
export async function getTrainingEvents() {
  try {
    connectToDatabase();
    const trainings = await Training.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },
      {
        $project: {
          Id: "$_id",
          Subject: { $concat: ["$client.lastName", " - Training"] },
          Description: {
            $reduce: {
              input: "$dogs",
              initialValue: "",
              in: { $concat: ["$$value", "$$this.dogName", ", "] },
            },
          },
          StartTime: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M:%S",
              date: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      "T",
                      "$timeArrival",
                    ],
                  },
                  format: "%Y-%m-%dT%H:%M",
                },
              },
            },
          },
          EndTime: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M:%S",
              date: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      "T",
                      "$timeDeparture",
                    ],
                  },
                  format: "%Y-%m-%dT%H:%M",
                },
              },
            },
          },
        },
      },
    ]).exec();
    return JSON.parse(JSON.stringify(trainings));
  } catch (error) {
    console.error("Error fetching trainings:", error);
    throw error;
  }
}
export async function getTrainingById(id: string) {
  try {
    connectToDatabase();
    const training = await Training.findById(id).populate({
      path: "clientId",
      model: Client,
      select: "firstName lastName",
    });
    return JSON.parse(JSON.stringify(training));
  } catch (error) {
    console.error("Error fetching training:", error);
  }
}
export async function editTrainingDate(id: string, date: Date) {
  if (!date) {
    return;
  }
  try {
    connectToDatabase();
    const updatedTraining = JSON.parse(
      JSON.stringify(
        await Training.findByIdAndUpdate(id, { date }, { new: true })
      )
    );
    if (updatedTraining) {
      const appointment = JSON.parse(
        JSON.stringify(await Appointment.findOne({ Id: updatedTraining._id }))
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
      return updatedTraining;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function editTrainingArrival(
  id: string,
  timeArrival: Date | undefined
) {
  if (!timeArrival) {
    return;
  }
  try {
    connectToDatabase();
    const updatedTraining = JSON.parse(
      JSON.stringify(
        await Training.findByIdAndUpdate(
          id,
          { timeArrival: formatTime(timeArrival, "el") },
          { new: true }
        )
      )
    );
    if (updatedTraining) {
      const appointment = JSON.parse(
        JSON.stringify(await Appointment.findOne({ Id: updatedTraining._id }))
      );
      if (appointment) {
        const startTime = new Date(updatedTraining.date);
        startTime.setHours(
          parseInt(formatTime(timeArrival, "el").split(":")[0], 10),
          parseInt(formatTime(timeArrival, "el").split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(appointment._id, {
          StartTime: startTime,
        });
      }
      return updatedTraining;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editTrainingDeparture(
  id: string,
  timeDeparture: Date | undefined
) {
  if (!timeDeparture) {
    return;
  }
  try {
    connectToDatabase();
    const updatedTraining = JSON.parse(
      JSON.stringify(
        await Training.findByIdAndUpdate(
          id,
          { timeDeparture: formatTime(timeDeparture, "el") },
          { new: true }
        )
      )
    );
    if (updatedTraining) {
      const appointment = JSON.parse(
        JSON.stringify(await Appointment.findOne({ Id: updatedTraining._id }))
      );
      if (appointment) {
        const endTime = new Date(updatedTraining.date);
        endTime.setHours(
          parseInt(formatTime(timeDeparture, "el").split(":")[0], 10),
          parseInt(formatTime(timeDeparture, "el").split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(appointment._id, {
          EndTime: endTime,
        });
      }
      return updatedTraining;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
