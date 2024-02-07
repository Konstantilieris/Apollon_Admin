/* eslint-disable camelcase */
"use server";

import { CreateClientParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Client from "@/database/models/client.model";

export async function CreateClient(params: CreateClientParams) {
  try {
    connectToDatabase();
    const {
      firstName,
      lastName,
      email,
      profession,
      birthdate,
      residence,
      address,
      city,
      telephone,
      mobile,
      name,
      gender,
      food,
      breed,
      behavior,
      vet,
      vetNumber,
      dog_birthdate,
    } = params;

    const client = await Client.create({
      firstName,
      lastName,
      email,
      profession,
      birthdate,
      location: { residence, address, city },
      phone: { telephone, mobile },
      dog: {
        name,
        gender,
        birthdate: dog_birthdate,
        food,
        breed,
        behavior,
        vet,
        vetNumber,
      },
    });
    return JSON.stringify(client);
  } catch (error) {
    console.log("Failed to create client", error);
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
          input: { $concat: ["$firstName", " ", "$lastName"] },
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
