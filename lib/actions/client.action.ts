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
