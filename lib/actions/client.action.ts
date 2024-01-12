/* eslint-disable camelcase */
"use server";

import { CreateClientParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Client from "@/database/models/client.model";

interface GetClientsParams {
  searchQuery?: string;
}
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
      dog_name,
      dog_gender,
      dog_food,
      dog_breed,
      dog_behavior,
      dog_vet,
      dog_vetNumber,
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
        name: dog_name,
        gender: dog_gender,
        food: dog_food,
        breed: dog_breed,
        behavior: dog_behavior,
        vet: dog_vet,
        vetNumber: dog_vetNumber,
        birthdate: dog_birthdate,
      },
    });
    return { client };
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
export async function getAllClientsByQuery(params: GetClientsParams) {
  try {
    connectToDatabase();
    const { searchQuery } = params;

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
