/* eslint-disable camelcase */
"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import Client, { IClient, IDog } from "@/database/models/client.model";
import Service from "@/database/models/service.model";
import { sanitizeQuery } from "../utils";
import mongoose from "mongoose";
import Booking, { IBooking } from "@/database/models/booking.model";
import { DateRange } from "react-day-picker";

interface CreateClientProps {
  clientData: {
    name: string;
    email: string;
    profession: string;
    residence: string;
    address: string;
    city: string;
    postalCode: string;
    telephone: string;
    mobile: string;
    workMobile: string;
    emergencyContact: string;
    vetName: string;
    vetNumber: string;
    vetWorkPhone: string;
    isTraining: boolean;
    reference: any;
  };
  dogs: IDog[];
  path: string;
}
export async function getDogsForClient(clientId: string) {
  try {
    connectToDatabase();
    const client = await Client.findById(clientId).select("dog");
    if (!client) {
      throw new Error("Client not found");
    }
    return JSON.stringify(client.dog);
  } catch (error) {
    console.error("Error retrieving dogs for client:", error);
    throw error;
  }
}

export async function CreateClient({
  clientData,
  dogs,
  path,
}: CreateClientProps) {
  const clientPayload: IClient = {
    name: clientData.name,
    email: clientData.email,
    profession: clientData.profession,

    location: {
      residence: clientData.residence,
      address: clientData.address,
      city: clientData.city,
      postalCode: clientData.postalCode,
    },
    phone: {
      telephone: clientData.telephone,
      mobile: clientData.mobile,
      work_phone: clientData.workMobile,
      emergencyContact: clientData.emergencyContact,
    },
    vet: {
      name: clientData.vetName,
      phone: clientData.vetNumber,
      work_phone: clientData.vetWorkPhone,
    },
    isTraining: clientData.isTraining,
    references: {
      isReferenced: clientData.reference,
    },
  };
  try {
    connectToDatabase();

    const client = await Client.create({
      ...clientPayload,
      dog: dogs,
    });
    revalidatePath(path);
    if (client) return JSON.stringify(client);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllClientsByQuery(
  searchQuery: string | undefined,
  limit?: number
) {
  try {
    connectToDatabase();
    let query = {};
    if (searchQuery) {
      query = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          {
            "dog.name": {
              $regex: searchQuery,
              $options: "i",
            },
          },
        ],
      };
    }
    const clients = await Client.find(query, { name: 1 }).limit(limit || 5);
    return JSON.parse(JSON.stringify(clients));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getClientById(id: string | undefined) {
  try {
    connectToDatabase();
    const client = await Client.findById(id);
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getClientByIdForSuccess(id: string | undefined) {
  try {
    connectToDatabase();
    const client = await Client.findById(id, { name: 1, createdAt: 1 });
    return JSON.parse(JSON.stringify(client));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getClientByIdForBooking(id: string | undefined) {
  try {
    await connectToDatabase();

    const client = await Client.aggregate([
      { $match: { _id: id ? new mongoose.Types.ObjectId(id) : null } },
      {
        $project: {
          name: 1,
          dog: 1,
          "phone.mobile": 1,
          "location.address": 1,
          "location.city": 1,
          roomPreference: 1,
          bookingFee: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$serviceFees",
                  as: "fee",
                  cond: { $eq: ["$$fee.type", "bookingFee"] },
                },
              },
              0,
            ],
          },
          transportFee: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$serviceFees",
                  as: "fee",
                  cond: { $eq: ["$$fee.type", "transportFee"] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          dog: {
            $filter: {
              input: "$dog",
              as: "dog",
              cond: { $eq: ["$$dog.dead", false] },
            },
          },
        },
      },
      {
        $addFields: {
          bookingFee: {
            $ifNull: ["$bookingFee.value", null],
          },
          transportFee: {
            $ifNull: ["$transportFee.value", null],
          },
        },
      },
    ]);

    return client.length ? client[0] : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function chargeClient({
  clientId,
  path,
  serviceType,
  amount,
  date,
}: any) {
  try {
    connectToDatabase();

    const service = await Service.create({
      serviceType,
      clientId,
      amount: +amount,
    });
    if (service) {
      const client = await Client.findByIdAndUpdate(
        clientId,
        { $push: { owes: service._id } },
        { new: true }
      );
      if (client) {
        revalidatePath(path);
        return JSON.parse(JSON.stringify(client));
      } else {
        throw new Error("Client not found");
      }
    }
  } catch (error) {
    console.error("Error charging client:", error);
    throw error;
  }
}

export async function payOffClient({ path, serviceId }: any) {
  try {
    connectToDatabase();
    const service = await Service.findByIdAndUpdate(
      { _id: serviceId },
      { paid: true, paymentDate: new Date() },
      { new: true }
    );
    if (!service) {
      throw new Error("Service not found");
    } else {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(service));
    }
  } catch (error) {
    console.error("Error paying off client:", error);
    throw error;
  }
}
export async function uncheckedPayment({ serviceId, path }: any) {
  try {
    connectToDatabase();
    const service = await Service.findByIdAndUpdate(
      { _id: serviceId },
      { paid: false, paymentDate: null },
      { new: true }
    );
    if (!service) {
      throw new Error("Service not found");
    } else {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(service));
    }
  } catch (error) {
    console.error("Error unchecking payment:", error);
    throw error;
  }
}
export async function calculateAverageNewClients(startDate: Date) {
  // Calculate the start date of the previous month
  const previousMonthStartDate = new Date(startDate);
  previousMonthStartDate.setMonth(startDate.getMonth() - 1);

  try {
    connectToDatabase();
    // Fetch all clients created in the previous months
    const clientsInPreviousMonths = await Client.find({
      createdAt: { $gte: previousMonthStartDate, $lt: startDate },
    }).countDocuments();

    // Calculate the average
    const numberOfMonths = Math.ceil(
      (startDate.getTime() - previousMonthStartDate.getTime()) /
        (1000 * 3600 * 24 * 30)
    );
    const averageNewClients = clientsInPreviousMonths / numberOfMonths;
    return averageNewClients;
  } catch (error) {
    console.error("Error calculating average new clients:", error);
    return null;
  }
}
export async function analyzeNewClientsThisMonth() {
  const currentDate = new Date();
  const startDateOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  try {
    connectToDatabase();
    const newClientsThisMonth = await Client.find({
      createdAt: { $gte: startDateOfMonth },
    }).countDocuments();
    const averageNewClients =
      await calculateAverageNewClients(startDateOfMonth);
    let difference;
    if (averageNewClients !== null) {
      difference = newClientsThisMonth - averageNewClients;
    }
    return {
      newClientsThisMonth,
      averageNewClients,
      difference,
    };
  } catch (error) {
    console.error("Error analyzing new clients this month:", error);
    throw error;
  }
}

export async function countClientsByMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Initialize an object to store the counts for each month
  const clientsByMonth: any = [];

  // Loop through each month of the current year
  for (let month = 0; month < currentDate.getMonth() + 1; month++) {
    // Set the start date of the current month
    const startDateOfMonth = new Date(currentYear, month, 1);

    // Calculate the end date of the current month
    const endDateOfMonth = new Date(currentYear, month + 1, 0, 23, 59, 59);

    try {
      connectToDatabase();
      const count = await Client.find({
        createdAt: { $gte: startDateOfMonth, $lte: endDateOfMonth },
      }).countDocuments();

      // Store the count for the current month
      clientsByMonth.push({
        month: startDateOfMonth.toLocaleString("el-GR", {
          month: "long",
        }),
        count,
      });
    } catch (error) {
      console.error(
        `Error counting clients for ${startDateOfMonth.toLocaleString(
          "default",
          { month: "long" }
        )}:`,
        error
      );
    }
  }

  return clientsByMonth;
}
export async function globalSearch({ query }: any) {
  try {
    connectToDatabase();
    const cleanQuery = sanitizeQuery(query);
    const clients = await Client.find(
      {
        $or: [
          { name: { $regex: cleanQuery, $options: "i" } },
          { profession: { $regex: cleanQuery, $options: "i" } },
          { "dog.name": { $regex: cleanQuery, $options: "i" } },
        ],
      },
      { name: 1, profession: 1, dog: 1 },
      { sort: { name: 1, dog: 1, profession: 1 } }
    ).limit(5);

    return JSON.stringify(clients);
  } catch (error) {
    console.error("Error searching clients:", error);
    throw error;
  }
}
export async function updateClientBookingFee({
  clientId,
  price,
  path,
}: {
  clientId: string;
  price: number;
  path: string;
}) {
  try {
    await connectToDatabase();

    if (!price) {
      throw new Error("Price is required");
    }

    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        "serviceFees.type": "bookingFee",
      },
      {
        $set: { "serviceFees.$.value": price },
      },
      { new: true }
    );

    if (!client) {
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { $push: { serviceFees: { type: "bookingFee", value: price } } },
        { new: true }
      );

      if (!updatedClient) {
        throw new Error("Client not found");
      }

      revalidatePath(path);
      return true;
    }

    revalidatePath(path);
    return true;
  } catch (error) {
    console.error("Error updating client price:", error);
    throw error;
  }
}
export async function updateClientTransportationFee({
  clientId,
  price,
  path,
}: {
  clientId: string;
  price: number;
  path: string;
}) {
  try {
    await connectToDatabase();

    if (!price) {
      throw new Error("Price is required");
    }

    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        "serviceFees.type": "transportFee",
      },
      {
        $set: { "serviceFees.$.value": price },
      },
      { new: true }
    );
    if (!client) {
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { $push: { serviceFees: { type: "transportFee", value: price } } },
        { new: true }
      );

      if (!updatedClient) {
        throw new Error("Client not found");
      }

      revalidatePath(path);
      return true;
    }
    revalidatePath(path);
    return true;
  } catch (error) {
    console.error("Error updating client price:", error);
    throw error;
  }
}

export async function getAllClients({
  page,
  query,
  fromDate,
  toDate,
}: {
  page: number;
  query: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}) {
  try {
    // Connect to the database
    await connectToDatabase();

    const limit = 10;
    const skip = (page - 1) * limit;
    const queryObject: any = {};

    // Build query object for search
    if (query) {
      queryObject.$or = [
        { name: { $regex: query, $options: "i" } },
        { "phone.mobile": { $regex: query, $options: "i" } },
        { profession: { $regex: query, $options: "i" } },
        { "dog.name": { $regex: query, $options: "i" } },
        { "location.city": { $regex: query, $options: "i" } },
        { "location.address": { $regex: query, $options: "i" } },
      ];
    }

    // Add date range to query object
    if (fromDate && toDate) {
      queryObject.createdAt = { $gte: fromDate, $lte: toDate };
    }

    // Use aggregation to match, skip, and limit results
    const clients = await Client.aggregate([
      { $match: queryObject },
      {
        $addFields: {
          dog: {
            $filter: {
              input: "$dog",
              as: "dog",
              cond: { $eq: ["$$dog.dead", false] },
            },
          },
        },
      },
      { $sort: { name: 1, profession: 1, "dog.name": 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total clients matching the query
    const totalClients = await Client.countDocuments(queryObject);

    // Determine if there are more pages
    const isNext = skip + limit < totalClients;

    // Return clients, isNext, and totalClients
    return {
      clients,
      isNext,
      totalClients,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateClientDogNote({
  clientId,
  dogId,
  note,
  path,
}: {
  clientId: string;
  dogId: string;
  note: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findOneAndUpdate(
      { _id: clientId, "dog._id": dogId },
      { $set: { "dog.$.note": note } },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.stringify(client);
  } catch (error) {
    console.error("Error updating dog note:", error);
    throw error;
  }
}
export async function updateClient({
  id,
  data,
  path,
}: {
  id: string;
  data: any;
  path: string;
}) {
  const clientPayload: IClient = {
    name: data.name,
    email: data.email,
    profession: data.profession,
    location: {
      residence: data.residence,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
    },
    phone: {
      telephone: data.telephone,
      mobile: data.mobile,
      work_phone: data.workMobile,
      emergencyContact: data.emergencyContact,
    },
    vet: {
      name: data.vetName,
      phone: data.vetNumber,
    },
  };
  try {
    connectToDatabase();
    const client = await Client.findByIdAndUpdate(id, clientPayload, {
      new: true,
    });
    if (client) {
      revalidatePath(path);
      return JSON.stringify(client);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateClientNote({
  clientId,
  note,
  path,
}: {
  clientId: string;
  note: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findByIdAndUpdate(
      clientId,
      { notes: note },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.stringify(client);
  } catch (error) {
    console.error("Error updating client note:", error);
    throw error;
  }
}
export async function updateClientDogDead({
  clientId,
  dogId,
  path,
}: {
  clientId: string;
  dogId: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findOneAndUpdate(
      { _id: clientId, "dog._id": dogId },
      { $set: { "dog.$.dead": true } },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.stringify(client);
  } catch (error) {
    console.error("Error updating dog dead:", error);
    throw error;
  }
}
export async function addClientDog({
  clientId,
  dog,
  path,
}: {
  clientId: string;
  dog: IDog;
  path: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $push: { dog } },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.stringify(client);
  } catch (error) {
    console.error("Error adding client dog:", error);
    throw error;
  }
}
export async function updateClientDog({
  clientId,
  dog,
  dogId,
  path,
}: {
  clientId: string;
  dogId: string;
  dog: any;
  path: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findOneAndUpdate(
      { _id: clientId, "dog._id": dogId },
      { $set: { "dog.$": dog } },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.parse(JSON.stringify(client));
  } catch (error) {
    console.error("Error updating client dog:", error);
    throw error;
  }
}
const checkBookingInRangeWithRoomId = async (
  roomId: string,
  fromDate: Date,
  toDate: Date
) => {
  try {
    connectToDatabase();
    const booking = await Booking.findOne({
      $or: [{ fromDate: { $lte: toDate }, toDate: { $gte: fromDate } }],
      // Check if any dog has the specified roomId
      "dogs.roomId": roomId,
    });
    return !!booking;
  } catch (error) {
    console.error("Error checking booking in range with room id:", error);
    throw error;
  }
};
export async function getLastBookingOfClient({
  clientId,

  rangeDate,
}: {
  clientId: string;

  rangeDate: DateRange;
}) {
  try {
    connectToDatabase();

    let rooms: any = [];
    const client = await Client.findById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }
    const lastBooking: IBooking[] = await Booking.find(
      { "client.clientId": clientId },
      {},
      { sort: { createdAt: -1 } }
    ).limit(1);

    if (lastBooking.length === 0) {
      return { type: client.roomPreference, rooms: [] };
    }

    if (client.roomPreference === "Join") {
      const availability = await checkBookingInRangeWithRoomId(
        (lastBooking[0].dogs[0] as any).roomId,
        rangeDate.from!,
        rangeDate.to!
      );
      rooms = {
        roomId: JSON.parse(
          JSON.stringify((lastBooking[0].dogs[0] as any).roomId)
        ),
        roomName: (lastBooking[0].dogs[0] as any).roomName,
        dogName: (lastBooking[0].dogs[0] as any).dogName,
        availability,
      };
    } else {
      for (const dog of lastBooking[0].dogs) {
        const room = {
          roomId: JSON.parse(JSON.stringify((dog as any).roomId)),
          roomName: (dog as any).roomName,
          dogName: (dog as any).dogName,
          dogId: JSON.parse(JSON.stringify((dog as any).dogId)),
          availability: await checkBookingInRangeWithRoomId(
            (dog as any).roomId,
            rangeDate.from!,
            rangeDate.to!
          ),
        };

        rooms.push(room);
      }
    }
    console.log(rooms);
    return { type: client.roomPreference, rooms };
  } catch (error) {
    console.error("Error retrieving last booking of client:", error);
    throw error;
  }
}
export async function pushTagOnClient({
  clientId,
  tag,
}: {
  clientId: string;
  tag: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $push: { tags: tag } },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
  } catch (error) {
    console.error("Error pushing tag on client:", error);
    throw error;
  }
}
export async function getClientByIdForProfile(id: string | undefined) {
  try {
    await connectToDatabase();

    const client = await Client.aggregate([
      { $match: { _id: id ? new mongoose.Types.ObjectId(id) : null } },
      {
        $project: {
          name: 1,

          "phone.mobile": 1,
          location: 1,
          tags: 1,
          lastActivity: 1,
          points: 1,
          loyalty: 1,
          serviceFees: 1,
          createdAt: 1,
          status: 1,
          loyaltyLevel: 1,
          bookingFee: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$serviceFees",
                  as: "fee",
                  cond: { $eq: ["$$fee.type", "bookingFee"] },
                },
              },
              0,
            ],
          },
          transportFee: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$serviceFees",
                  as: "fee",
                  cond: { $eq: ["$$fee.type", "transportFee"] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          dog: {
            $filter: {
              input: "$dog",
              as: "dog",
              cond: { $eq: ["$$dog.dead", false] },
            },
          },
        },
      },
      {
        $addFields: {
          bookingFee: {
            $ifNull: ["$bookingFee.value", null],
          },
          transportFee: {
            $ifNull: ["$transportFee.value", null],
          },
        },
      },
    ]);

    return client.length ? client[0] : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
