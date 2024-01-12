"use server";

import Room from "@/database/models/room.model";
import { connectToDatabase } from "../mongoose";

interface CreateRoomParams {
  name: string;
}
export async function createRooms(params: CreateRoomParams) {
  try {
    connectToDatabase();
    const { name } = params;
    await Room.create({ name, price: 25 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllRooms() {
  try {
    connectToDatabase();
    const rooms = await Room.find().sort({ name: 1 });
    return JSON.stringify(rooms);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
