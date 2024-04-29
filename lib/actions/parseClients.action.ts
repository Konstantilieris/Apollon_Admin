"use server";
import fs from "fs";
import { connectToDatabase } from "../mongoose";
import Client from "@/database/models/client.model";

import Service from "@/database/models/service.model";
import { numberToHexString } from "../utils";
export async function parseClients() {
  const filePath = "/Users/Cringiano/Desktop/old/oldClients.json";

  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    const modifiedData = jsonData.map((item: any) => ({
      clientData: {
        _id: numberToHexString(+item._id),
        firstName: item.firstName,
        lastName: item.lastName,
        vet: item.vet,
        vetNumber: item.vetNumber,
        location: {
          residence: item.residence,
          address: item.address,
          city: item.city,
        },
        phone: {
          telephone: item.telephone,
          mobile: item.mobile,
        },

        notes: item.notes,
      },
      dog: {
        name: item.dogName,
        birthdate: new Date(item.birthdate),
        gender: item.gender,
        breed: item.breed,
        food: item.food,
      },
    }));

    connectToDatabase();
    modifiedData.forEach(async (item: any) => {
      await Client.create({
        ...item.clientData,
        dog: [item.dog],
      });
    });
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

export async function parseServices() {
  const filePath = "/Users/Cringiano/Desktop/old/booking.json";

  try {
    connectToDatabase();
    const fileData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    const modifiedData = jsonData.map((item: any) => ({
      serviceType: item.serviceType,
      amount: +item.amount,
      clientId: numberToHexString(+item._id),
      date: new Date(item.date),
      paid: true,

      paymentDate: item.PaymentDate,
    }));
    for (const item of modifiedData) {
      const service = await Service.create({ ...item });
      if (service) {
        await Client.findByIdAndUpdate(
          { _id: item.clientId },
          { $push: { owes: service._id } },
          { new: true }
        );
      }
    }
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}
