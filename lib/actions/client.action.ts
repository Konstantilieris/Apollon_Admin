/* eslint-disable camelcase */
"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import Client, { IClient } from "@/database/models/client.model";
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
export async function CreateClient({ clientData, dogs }: any) {
  const clientPayload: IClient = {
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    email: clientData.email,
    profession: clientData.profession,
    birthdate: clientData.birthdate,
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
    },
    vet: clientData.vet,
    vetNumber: clientData.vetNumber,
    emergencyContact: clientData.emergencyContact,
  };
  try {
    connectToDatabase();

    const client = await Client.create({
      ...clientPayload,
      dog: dogs,
    });
    if (client) return JSON.stringify(client);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllClients() {
  try {
    connectToDatabase();

    const clients = await Client.find();
    return JSON.stringify(clients);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllClientsByQuery(searchQuery: string | undefined) {
  try {
    connectToDatabase();

    if (!searchQuery) {
      const clients = await Client.find();
      return JSON.stringify(clients);
    }

    const clients = await Client.find({
      $expr: {
        $regexMatch: {
          input: { $concat: ["$firstName", "", "$lastName"] },
          regex: searchQuery,
          options: "i",
        },
      },
    });
    return JSON.stringify(clients);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getClientById(id: string) {
  try {
    connectToDatabase();
    const client = await Client.findById(id);
    return client;
  } catch (error) {
    console.log(error);
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
    const serviceObject = {
      serviceType,
      amount: +amount,
      date,
    };
    const client = await Client.findOneAndUpdate(
      { _id: clientId }, // Find the client document by _id
      { $push: { owes: serviceObject } }, // Push the service object onto the owes array
      { new: true } // Return the updated document after the update operation
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.parse(JSON.stringify(client));
  } catch (error) {
    console.error("Error charging client:", error);
    throw error;
  }
}
export async function payOffClient({
  clientId,
  path,
  serviceId,
  serviceType,
}: any) {
  try {
    connectToDatabase();
    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        "owes._id": serviceId, // Match client by ID and service within owes array by ID
      },
      {
        $set: {
          "owes.$[elem].paid": true, // Update the paid status of the matched service within owes array
        },
      },
      {
        new: true, // Return the updated client document
        arrayFilters: [{ "elem._id": serviceId }], // Apply filter to match the specific owes array element
      }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.parse(JSON.stringify(client));
  } catch (error) {
    console.error("Error paying off client:", error);
    throw error;
  }
}
export async function uncheckedPayment({ clientId, serviceId, path }: any) {
  try {
    connectToDatabase();
    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        "owes._id": serviceId,
      },
      {
        $set: {
          "owes.$[elem].paid": false,
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem._id": serviceId }],
      }
    );
    if (!client) {
      throw new Error("Client not found");
    }
    revalidatePath(path);
    return JSON.parse(JSON.stringify(client));
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
      // Count the number of clients created within the current month
      const count = await Client.find({
        createdAt: { $gte: startDateOfMonth, $lte: endDateOfMonth },
      }).countDocuments();

      // Store the count for the current month
      clientsByMonth.push({
        month: startDateOfMonth.toLocaleString("default", { month: "long" }),
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
