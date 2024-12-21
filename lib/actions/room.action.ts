"use server";

import Room from "@/database/models/room.model";
import { connectToDatabase } from "../mongoose";

import { DateRange } from "react-day-picker";
import { revalidatePath } from "next/cache";

export async function createRoom({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  try {
    connectToDatabase();

    const room = await Room.create({ name });
    if (room) {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(room));
    } // Return the created room
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAllRooms() {
  try {
    connectToDatabase();
    const rooms = await Room.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(rooms));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getRoomById(roomId: any) {
  try {
    connectToDatabase();
    const room = await Room.findById(roomId);
    if (room) {
      return JSON.stringify(room);
    } // Return the found room
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateRoomById(roomId: any, name: string, path: string) {
  try {
    connectToDatabase();

    const room = await Room.findByIdAndUpdate(roomId, { name }, { new: true });
    if (room) {
      return JSON.parse(JSON.stringify(room));
    } // Return the updated room
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllRoomsAndBookings({
  rangeDate,
  page,
  filter,
  query,
}: {
  rangeDate: DateRange;
  page: number;
  filter: string;
  query: string;
}) {
  try {
    connectToDatabase();

    const itemsPerPage = 4;
    const skipItems = (page - 1) * itemsPerPage;

    const matchBookings = {
      $or: [
        {
          $and: [
            { fromDate: { $lte: rangeDate.to } },
            { toDate: { $gte: rangeDate.to } },
          ],
        },
        {
          $and: [
            { fromDate: { $lte: rangeDate.from } },
            { toDate: { $gte: rangeDate.from } },
          ],
        },
        {
          $and: [
            { fromDate: { $gte: rangeDate.from } },
            { toDate: { $lte: rangeDate.to } },
          ],
        },
      ],
    };
    const filterCondition = () => {
      if (filter === "full") {
        return { currentBookingsCount: { $gt: 0 } };
      } else if (filter === "empty") {
        return { currentBookingsCount: 0 };
      }
      return {}; // No additional filter for 'all'
    };
    const rooms = await Room.aggregate([
      {
        $match: {
          name: { $regex: query, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "currentBookings",
          foreignField: "_id",
          as: "currentBookings",
          pipeline: [
            { $match: matchBookings },
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
                "client.firstName": 1,
                "client.lastName": 1,
                "client.dog.name": 1,
                fromDate: 1,
                toDate: 1,
                dogs: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          currentBookingsCount: { $size: "$currentBookings" },
        },
      },
      {
        $match: filterCondition(),
      },

      {
        $skip: skipItems,
      },
      {
        $limit: itemsPerPage + 1,
      },
    ]);
    const hasNextPage = rooms.length > itemsPerPage;
    if (hasNextPage) {
      rooms.pop();
    }
    return {
      allRooms: JSON.parse(JSON.stringify(rooms)),
      isNext: hasNextPage,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteRoomById(roomId: any, path: string) {
  try {
    connectToDatabase();
    const room = await Room.findByIdAndDelete(roomId);
    if (room) {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(room));
    } // Return the deleted room
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getRoomsForCalendar() {
  try {
    connectToDatabase();
    const rooms = await Room.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(rooms));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
