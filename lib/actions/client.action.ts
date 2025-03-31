/* eslint-disable camelcase */
"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import Client, { IClient, IDog } from "@/database/models/client.model";

import { sanitizeQuery } from "../utils";
import mongoose, { Schema } from "mongoose";
import Booking, { IBooking } from "@/database/models/booking.model";
import { DateRange } from "react-day-picker";
import moment from "moment";
import "moment/locale/el";
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
    vetLocation: {
      address: string;
      city: string;
      postalCode: string;
    };
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

export async function CreateClient({ clientData, dogs }: CreateClientProps) {
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
      location: {
        address: clientData.vetLocation.address,
        city: clientData.vetLocation.city,
        postalCode: clientData.vetLocation.postalCode,
      },
    },
    isTraining: clientData.isTraining,
    references: {
      isReferenced: clientData.reference,
    },
  };
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    connectToDatabase();

    const client = await Client.create([{ ...clientPayload, dog: dogs }], {
      session,
    });
    if (clientData.reference?.client?.clientId) {
      const referringClient = await Client.findById(
        clientData.reference.client.clientId
      ).session(session);

      if (referringClient) {
        referringClient.references?.hasReferenced?.push({
          name: client[0].name, // client is an array due to create() with transaction
          clientId: client[0]._id,
        });

        await referringClient.save({ session }); // Save updated referring client
      }
    }

    await session.commitTransaction(); // Commit the transaction
    session.endSession();

    return JSON.stringify(client[0]);
  } catch (error) {
    await session.abortTransaction(); // Rollback if any error occurs
    session.endSession();
    console.error("Transaction failed:", error);
    throw error;
  }
}

export async function getAllClientsByQuery() {
  try {
    connectToDatabase();

    const clients = await Client.find({}, { name: 1 });
    return JSON.stringify(clients);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getClientById(id: string | undefined) {
  try {
    connectToDatabase();
    const client = await Client.findById(id);
    return JSON.stringify(client);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getClientById2(id: string | undefined) {
  try {
    connectToDatabase();
    const client = await Client.findById(id); // Use `lean()` for better performance

    if (!client) {
      return null; // Return null if no client is found
    }

    // Manually filter out dead dogs
    if (client.dog && Array.isArray(client.dog)) {
      client.dog = client.dog.filter((dog: any) => !dog.dead);
    }

    return JSON.parse(JSON.stringify(client));
  } catch (error) {
    console.error("Error fetching client:", error);
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
  if (!id) {
    return null;
  }
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

    return client.length ? JSON.stringify(client[0]) : null;
  } catch (error) {
    console.error(error);
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

export async function countClientsByMonth({
  year = new Date().getFullYear(),
}: {
  year?: number;
}) {
  // Initialize an array to store the counts for each month
  const clientsByMonth = [];

  // Loop through each month of the specified year
  const monthsInYear = 12;

  for (let month = 0; month < monthsInYear; month++) {
    // Set the start date of the current month
    const startDateOfMonth = new Date(year, month, 1);

    // Calculate the end date of the current month
    const endDateOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    try {
      // Ensure database connection
      await connectToDatabase();

      // Count the number of clients created in the current month
      const count = await Client.find({
        createdAt: { $gte: startDateOfMonth, $lte: endDateOfMonth },
      }).countDocuments();

      // Store the count for the current month
      clientsByMonth.push({
        date: startDateOfMonth.toISOString(),
        count,
      });
    } catch (error) {
      console.error(
        `Error counting clients for ${startDateOfMonth.toLocaleString("en-US", {
          month: "long",
        })}, ${year}:`,
        error
      );
    }
  }

  return clientsByMonth;
}

export async function globalSearch({ query }: { query: string }) {
  try {
    connectToDatabase();

    const cleanQuery = sanitizeQuery(query);

    const clients = await Client.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: cleanQuery, $options: "i" } },
            { profession: { $regex: cleanQuery, $options: "i" } },
            { "dog.name": { $regex: cleanQuery, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          name: 1,
          profession: 1,
          dog: {
            $filter: {
              input: "$dog",
              as: "d",
              cond: { $ne: ["$$d.dead", true] },
            },
          },
        },
      },
      { $sort: { name: 1, "dog.name": 1, profession: 1 } },
      { $limit: 7 },
    ]); // ✅ Ensures returned objects are plain JSON

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
export async function getClients() {
  try {
    await connectToDatabase();

    const clients = await Client.find({});

    return JSON.stringify(clients);
  } catch (error) {
    console.error(error);
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
        { "phone.telephone": { $regex: query, $options: "i" } },
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
      work_phone: data.vetWorkPhone,
      location: {
        address: data.vetLocation.address,
        city: data.vetLocation.city,
        postalCode: data.vetLocation.postalCode,
      },
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
  dog: any;
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
    return !booking;
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
          credit: 1,
          loyaltyLevel: 1,
          owesTotal: 1,
          totalSpent: 1,
          dog: 1, // <-- explicitly add this to include dog data
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
          bookingFee: { $ifNull: ["$bookingFee.value", null] },
          transportFee: { $ifNull: ["$transportFee.value", null] },
        },
      },
    ]);

    return client.length ? JSON.parse(JSON.stringify(client[0])) : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getClientsServicePreferences({ id }: { id: string }) {
  try {
    connectToDatabase();
    const client = await Client.findById(id, {
      servicePreferences: 1,
      serviceFees: 1,
    });

    return JSON.parse(JSON.stringify(client));
  } catch (error) {
    console.error("Error getting clients service preferences:", error);
    throw error;
  }
}
export async function getClientStatistics() {
  try {
    connectToDatabase(); // Replace with your MongoDB connection string

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfCurrentMonth.getTime() - 1);

    // Get total number of clients
    const totalClients = await Client.countDocuments();

    // Aggregate client registrations for the current and last month
    const registrations = await Client.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth }, // Filter clients created from the start of last month onwards
        },
      },
      {
        $addFields: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          count: { $sum: 1 }, // Count the number of clients per month
        },
      },
    ]);

    // Extract counts for the current and last month
    const currentMonthRegistrations =
      registrations.find(
        (r) =>
          r._id.year === now.getFullYear() && r._id.month === now.getMonth() + 1
      )?.count || 0;

    const lastMonthRegistrations =
      registrations.find(
        (r) =>
          r._id.year === endOfLastMonth.getFullYear() &&
          r._id.month === endOfLastMonth.getMonth() + 1
      )?.count || 0;

    // Calculate percentage increase
    const clientIncrease =
      lastMonthRegistrations > 0
        ? ((currentMonthRegistrations - lastMonthRegistrations) /
            lastMonthRegistrations) *
          100
        : currentMonthRegistrations > 0
          ? 100
          : 0;

    return {
      totalClients,
      clientIncrease,
    };
  } catch (error) {
    console.error("Error calculating client statistics:", error);
    throw new Error("Failed to calculate client statistics.");
  }
}
export async function getRegistrationsForPast6Months() {
  try {
    connectToDatabase();

    const sixMonthsAgo = moment()
      .subtract(6, "months")
      .startOf("month")
      .toDate(); // Start from the beginning of the 6th month

    // Aggregate query to group clients by month and count them
    const result = await Client.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }, // Filter for the past 6 months
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month of createdAt
          count: { $sum: 1 }, // Count the number of clients
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month in ascending order
      },
    ]);

    // Transform the result into a readable format
    const monthlyRegistrations = result.map((item) => ({
      month: moment()
        .month(item._id - 1)
        .format("MMMM"), // Convert month number to name
      numberOfClients: item.count,
    }));

    return monthlyRegistrations;
  } catch (error) {
    console.error(`Error fetching client registrations:`, error);
    throw error;
  }
}
export async function getIfDogsBehaviorUnaccepted({
  clientId,
}: {
  clientId: string;
}) {
  try {
    connectToDatabase();
    const client = await Client.findById(clientId, { dog: 1 });
    if (!client) {
      throw new Error("Client not found");
    }
    const dogs = client.dog;
    let unaccepted = false;
    for (const dog of dogs) {
      if (dog.behavior === "Unaccepted") {
        unaccepted = true;
        break;
      }
    }
    return unaccepted;
  } catch (error) {
    console.error("Error checking if dogs behavior is unaccepted:", error);
    throw error;
  }
}
export async function getAverageStay(clientId: string): Promise<number> {
  try {
    connectToDatabase();
    // Find all bookings for the given clientId
    const bookings = await Booking.find({ "client.clientId": clientId });

    if (bookings.length === 0) {
      console.log("No bookings found for the given clientId.");
      return 0; // Return 0 if no bookings found
    }

    // Calculate total stay duration in days
    const totalStay = bookings.reduce((sum, booking) => {
      const fromDate = new Date(booking.fromDate);
      const toDate = new Date(booking.toDate);
      const stayDuration =
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24); // Difference in days
      return sum + stayDuration;
    }, 0);

    // Calculate the average stay
    const avgStay = totalStay / bookings.length;

    return avgStay;
  } catch (error) {
    console.error("Error calculating average stay:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
export async function getBookingLength(clientId: string): Promise<number> {
  try {
    connectToDatabase();
    const bookings = await Booking.find({
      "client.clientId": clientId,
    }).countDocuments();
    if (bookings === 0) {
      console.log("No bookings found for the given clientId.");
      return 0;
    }

    return bookings;
  } catch (error) {
    console.error("Error calculating booking length:", error);
    throw error;
  }
}
export async function getAverageBookingsPerMonth(
  clientId: string
): Promise<number> {
  try {
    // Fetch all bookings for the client
    connectToDatabase();
    const bookings = await Booking.find({ "client.clientId": clientId });

    if (bookings.length === 0) {
      console.log("No bookings found for the given clientId.");
      return 0; // Return 0 if no bookings exist
    }

    // Determine the earliest and latest dates in the bookings
    const earliestBooking = bookings.reduce(
      (earliest, current) =>
        current.fromDate < earliest.fromDate ? current : earliest,
      bookings[0]
    );
    const latestBooking = bookings.reduce(
      (latest, current) => (current.toDate > latest.toDate ? current : latest),
      bookings[0]
    );

    const totalMonths =
      (latestBooking.toDate.getFullYear() -
        earliestBooking.fromDate.getFullYear()) *
        12 +
      (latestBooking.toDate.getMonth() - earliestBooking.fromDate.getMonth()) +
      1;

    // Calculate average bookings per month
    const avgBookingsPerMonth = bookings.length / totalMonths;

    return avgBookingsPerMonth;
  } catch (error) {
    console.error("Error calculating average bookings per month:", error);
    throw error;
  }
}
export async function getLastBooking(clientId: string) {
  try {
    connectToDatabase();
    const lastBooking = await Booking.find({
      "client.clientId": clientId,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    if (lastBooking.length === 0) {
      console.log("No bookings found for the given clientId.");
      return null;
    }
    return JSON.parse(JSON.stringify(lastBooking[0]));
  } catch (error) {
    console.error("Error fetching last booking:", error);
    throw error;
  }
}
export async function handleDeleteTag({
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
      { $pull: { tags: tag } },
      { new: true }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting tag:", error);

    throw error;
  }
}
export async function handleAddClientTag({
  clientId,
  tag,
}: {
  clientId: string;
  tag: string;
}) {
  try {
    connectToDatabase();

    // first check for duplicate tags
    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    if (client.tags.includes(tag)) {
      return { success: true };
    }
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { $push: { tags: tag } },
      { new: true }
    );
    if (!updatedClient) {
      throw new Error("Client not found");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error adding tag:", error);

    throw error;
  }
}
export async function updateClientServiceType(
  clientId: string,
  currentType: string,
  newType: string
) {
  await connectToDatabase();
  try {
    const client = await Client.findById(clientId);
    if (!client) throw new Error("Client not found");

    console.log("hit here");
    // Find and rename the service fee type without changing its value
    const feeIndex = client.serviceFees.findIndex(
      (fee: any) => fee.type === currentType
    );
    if (feeIndex !== -1) {
      client.serviceFees[feeIndex].type = newType;
    } else {
      throw new Error("Service fee type not found");
    }

    // Rename the corresponding service preference if it exists
    const preferenceIndex = client.servicePreferences.indexOf(currentType);
    if (preferenceIndex !== -1) {
      client.servicePreferences[preferenceIndex] = newType;
    }

    await client.save();
    return {
      success: true,
      message: "Service fee type and preference updated successfully",
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteClientService(
  clientId: Schema.Types.ObjectId,
  serviceType: string
) {
  await connectToDatabase();
  try {
    const client = await Client.findById(clientId);
    if (!client) throw new Error("Client not found");

    // Remove the service fee by type
    client.serviceFees = client.serviceFees.filter(
      (fee: any) => fee.type !== serviceType
    );

    // Remove the corresponding service preference
    client.servicePreferences = client.servicePreferences.filter(
      (preference: any) => preference !== serviceType
    );

    await client.save();
    return {
      success: true,
      message: "Service fee and preference deleted successfully",
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
export async function updateClientServiceFee({
  clientId,
  feeType, // e.g. "boardingFee", "transportFee", "bookingFee", etc.
  price,
  path,
}: {
  clientId: string;
  feeType: string;
  price: number;
  path: string;
}) {
  try {
    await connectToDatabase();

    if (!price) {
      throw new Error("Price is required");
    }

    // First try updating an existing serviceFees item matching feeType
    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        "serviceFees.type": feeType,
      },
      {
        $set: { "serviceFees.$.value": price },
      },
      { new: true }
    );

    // If no existing fee was updated, push a new object
    if (!client) {
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        {
          $push: {
            serviceFees: { type: feeType, value: price },
          },
        },
        { new: true }
      );

      if (!updatedClient) {
        throw new Error("Client not found");
      }

      revalidatePath(path);
      return true;
    }

    // If we successfully updated the existing service fee
    revalidatePath(path);
    return true;
  } catch (error) {
    console.error(`Error updating client fee for type "${feeType}":`, error);
    throw error;
  }
}
export async function updateClientServiceFeeBoarding({
  clientId,
  dogCount,
  price,
  path,
}: {
  clientId: string;
  dogCount: number;
  price: number;
  path: string;
}) {
  try {
    await connectToDatabase();

    if (price === undefined || price === null || isNaN(price)) {
      throw new Error("Valid price is required");
    }

    console.log("Updating booking fee manually:", {
      clientId,
      dogCount,
      price,
    });

    // 1. Find the client by ID
    const client = await Client.findById(clientId);
    if (!client) throw new Error("Client not found");

    // 2. Find index of the matching fee
    const index = client.serviceFees.findIndex(
      (fee: any) =>
        fee.type === "bookingFee" && Number(fee.dogCount) === Number(dogCount)
    );

    // 3. Update if exists
    if (index > -1) {
      console.log("Found existing fee, updating value");
      client.serviceFees[index].value = price;
    } else {
      // 4. Otherwise, push new one
      console.log("No matching fee found, pushing new one");
      client.serviceFees.push({
        type: "bookingFee",
        dogCount,
        value: price,
      });
    }
    revalidatePath(path);
    await client.save();

    console.log("Booking fee updated or added.");
    return true;
  } catch (error) {
    console.error("Error in updateClientServiceFeeBoarding:", error);
    throw error;
  }
}
