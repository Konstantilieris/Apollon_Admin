/* eslint-disable camelcase */
"use server";

import { connectToDatabase } from "../mongoose";
import Booking from "@/database/models/booking.model";

import Room from "@/database/models/room.model";
import { revalidatePath } from "next/cache";
import Client from "@/database/models/client.model";
import { DateRange } from "react-day-picker";
import Appointment from "@/database/models/event.model";
import Service from "@/database/models/service.model";
import mongoose from "mongoose";
import { setTimeOnDate } from "../utils";

interface TNTPROPS {
  id: string;
  type: string;
  time: string;
  initialDate: Date;
  oldTState: boolean;
  newTState: boolean;
  transportFee: number;
  path: string;
}
interface ICreateBooking {
  client: {
    clientId: string;
    clientName: string;
    transportFee?: number;
    bookingFee?: number;
    phone: string;
    location: string;
  };

  fromDate: Date;
  toDate: Date;
  totalprice: Number | undefined;
  path: string;
  bookingData: any;
  flag1: boolean;
  flag2: boolean;
  roomPreference: string;
}

export async function createBooking({
  fromDate,
  toDate,
  client,
  totalprice,
  path,
  flag1,
  flag2,
  bookingData,
  roomPreference,
}: ICreateBooking) {
  const session = await mongoose.startSession();

  try {
    connectToDatabase();
    session.startTransaction();
    await Client.findByIdAndUpdate(
      client.clientId,
      { $set: { roomPreference } },
      { session }
    );
    const booking = await Booking.create(
      [
        {
          client,
          fromDate,
          toDate,
          totalAmount: totalprice,
          flag1,
          flag2,
          dogs: bookingData,
        },
      ],
      { session }
    );

    const service = await Service.create(
      [
        {
          serviceType: "ΔΙΑΜΟΝΗ",
          amount: totalprice,
          clientId: client.clientId,
          bookingId: booking[0]._id, // Note that `booking` is an array
          date: fromDate,
        },
      ],
      { session }
    );

    const updatedClient = await Client.findOneAndUpdate(
      { _id: booking[0].client.clientId },
      { $push: { owes: service[0]._id } },
      { new: true, session }
    );

    if (!updatedClient) {
      throw new Error("Client not found");
    }
    const location = `${
      updatedClient.location.city ? updatedClient.location.city : ""
    }-${
      updatedClient.location.residence ? updatedClient.location.residence : ""
    }-${updatedClient.location.address ? updatedClient.location.address : ""}-${
      updatedClient.location.postalCode ? updatedClient.location.postalCode : ""
    }`;
    const description = `${updatedClient.name}-${
      updatedClient.phone.mobile ? updatedClient.phone.mobile : ""
    } 
    ${bookingData.map(({ dogName }: any) => `${dogName}`).join(", ")}`;

    if (flag1) {
      const pickUpAppointment = await Appointment.create(
        [
          {
            Id: booking[0]._id,
            Subject: `${updatedClient.name} - ΠΑΡΑΛΑΒΗ`,
            Type: "Taxi_PickUp",
            Description: description,
            isReadonly: true,
            Location: location,
            Color: "#7f1d1d",
            StartTime: fromDate,
            EndTime: fromDate,
          },
        ],
        { session }
      );

      if (!pickUpAppointment) {
        throw new Error("Failed to create pick up appointment");
      }
    } else {
      const arrivalAppointment = await Appointment.create(
        [
          {
            Id: booking[0]._id,
            Subject: `${updatedClient.name} - ΑΦΙΞΗ`,
            Type: "Arrival",
            isReadonly: true,
            Location: location,
            Color: "#1e3a8a",
            Description: description,
            StartTime: fromDate,
            EndTime: fromDate,
          },
        ],
        { session }
      );

      if (!arrivalAppointment) {
        throw new Error("Failed to create arrival appointment");
      }
    }

    if (flag2) {
      const deliveryAppointment = await Appointment.create(
        [
          {
            Id: booking[0]._id,
            Subject: `${updatedClient.name} - ΠΑΡΑΔΟΣΗ`,
            Type: "Τaxi_Delivery",
            Description: description,
            Location: location,
            isReadonly: true,
            Color: "#7f1d1d",
            StartTime: toDate,
            EndTime: toDate,
          },
        ],
        { session }
      );

      if (!deliveryAppointment) {
        throw new Error("Failed to create delivery appointment");
      }
    } else {
      const departureAppointment = await Appointment.create(
        [
          {
            Id: booking[0]._id,
            Subject: `${updatedClient.name} - ΑΝΑΧΩΡΗΣΗ`,
            Description: description,
            Type: "Departure",
            Location: location,
            isReadonly: true,
            Color: "#1e3a8a",
            StartTime: toDate,
            EndTime: toDate,
          },
        ],
        { session }
      );

      if (!departureAppointment) {
        throw new Error("Failed to create departure appointment");
      }
    }

    await session.commitTransaction();
    session.endSession();
    revalidatePath("/calendar");

    revalidatePath(path);
    return JSON.stringify(booking[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Failed to create booking", error);
    throw error;
  }
}

export async function getBookingById(bookingId: string) {
  try {
    connectToDatabase();
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    return JSON.stringify(booking);
  } catch (error) {
    console.error("Failed to retrieve booking:", error);
    throw error;
  }
}
export async function findBookingsWithinDateRange(rangeDate: DateRange) {
  try {
    connectToDatabase();
    const bookings = await Booking.find({
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
    });

    return JSON.stringify(bookings);
  } catch (error) {
    console.error("Error finding bookings within date range:", error);
    throw error;
  }
}

export async function clientBookings(clientId: string) {
  try {
    connectToDatabase();

    const bookings = await Booking.find({ clientId });
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error("Error retrieving bookings for client:", error);
    throw error;
  }
}

export async function checkExistingBooking({ rangeDate, clientId }: any) {
  try {
    connectToDatabase();
    if (!rangeDate.from || !rangeDate.to) {
      return true;
    }
    const existingBooking = await Booking.findOne({
      clientId,
      $or: [
        {
          $and: [
            { fromDate: { $lte: rangeDate.to } }, // Booking starts before or on rangeDate.toDate
            { toDate: { $gte: rangeDate.to } }, // Booking ends after or on rangeDate.toDate
          ],
        },
        {
          $and: [
            { fromDate: { $lte: rangeDate.from } }, // Booking starts before or on rangeDate.fromDate
            { toDate: { $gte: rangeDate.from } }, // Booking ends after or on rangeDate.fromDate
          ],
        },
        {
          $and: [
            { fromDate: { $gte: rangeDate.from } }, // Booking starts after or on rangeDate.fromDate
            { toDate: { $lte: rangeDate.to } }, // Booking ends before or on rangeDate.toDate
          ],
        },
      ],
    });
    if (existingBooking) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to check booking:", error);
    throw error;
  }
}

export async function countBookingsByMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Initialize an object to store the counts for each month
  const bookingsByMonth = [];

  // Loop through each month of the current year
  for (let month = 0; month < currentDate.getMonth() + 1; month++) {
    // Set the start date of the current month
    const startDateOfMonth = new Date(currentYear, month, 1);

    // Calculate the end date of the current month
    const endDateOfMonth = new Date(currentYear, month + 1, 0, 23, 59, 59);

    try {
      connectToDatabase();
      const count = await Booking.countDocuments({
        fromDate: { $gte: startDateOfMonth, $lte: endDateOfMonth },
      });

      // Store the count for the current month
      bookingsByMonth.push({
        month: startDateOfMonth.toLocaleString("en-US", { month: "long" }),
        count,
      });
    } catch (error) {
      console.error(
        `Error counting bookings for ${startDateOfMonth.toLocaleString(
          "el-GR",
          { month: "long" }
        )}:`,
        error
      );
    }
  }

  return bookingsByMonth;
}
export async function getAllBookings({
  fromDate,
  toDate,
  clientId,
  page = 1,
  query,
}: any) {
  try {
    await connectToDatabase();
    const limit = 10;
    const skip = (page - 1) * limit;
    const dateOptions: any = {};

    if (fromDate) {
      dateOptions.fromDate = { $gte: new Date(fromDate) };
    }
    if (toDate) {
      dateOptions.toDate = { $lte: new Date(toDate) };
    }

    const queryOptions: any = {};

    if (query) {
      const sanitizeInput = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      queryOptions.$or = [
        { "client.clientName": { $regex: sanitizeInput, $options: "i" } },
        { "client.phone": { $regex: sanitizeInput, $options: "i" } },
        { "client.location": { $regex: sanitizeInput, $options: "i" } },
        { "dogs.dogName": { $regex: sanitizeInput, $options: "i" } },
      ];
    }

    const pipeline: any = [
      {
        $match: { ...dateOptions, ...queryOptions },
      },
      {
        $project: {
          _id: 1,
          fromDate: 1,
          toDate: 1,
          totalAmount: 1,
          dogs: 1,
          flag1: 1,
          flag2: 1,
          client: 1,
        },
      },
      {
        $sort: { fromDate: -1 },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "total" }],
          totalSum: [
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
        },
      },
    ];

    const bookings = await Booking.aggregate(pipeline);
    const total = bookings[0].total[0]?.total || 0;
    const isNext = total > page * limit;
    return [
      JSON.parse(JSON.stringify(bookings[0].data)),
      isNext,
      bookings[0].totalSum[0]?.total || 0,
    ];
  } catch (error) {
    console.error("Failed to retrieve bookings:", error);
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
    const itemsPerPage = 6;
    const skipItems = (page - 1) * itemsPerPage;
    if (!rangeDate.from || !rangeDate.to) {
      return {
        allRooms: [],
        isNext: false,
      };
    }
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

    const rooms = await Room.find(
      { name: { $regex: query, $options: "i" } },
      {},
      { sort: { name: -1 } }
    );
    const bookings = await Booking.find(
      matchBookings,
      {},
      { sort: { fromDate: 1 } }
    );

    const roomMap = rooms.reduce((map, room) => {
      map[room._id.toString()] = {
        name: room.name,
        _id: room._id,
        currentBookings: [],
      };
      return map;
    }, {});
    bookings.forEach((booking) => {
      booking.dogs.forEach((dog: any) => {
        const roomId = dog.roomId.toString();
        if (roomMap[roomId]) {
          // Check if the booking is already added to the room's currentBookings
          const isBookingAlreadyAdded = roomMap[roomId].currentBookings.some(
            (b: any) => b.bookingId.toString() === booking._id.toString()
          );

          // If not added, push the booking to the currentBookings array
          if (!isBookingAlreadyAdded) {
            roomMap[roomId].currentBookings.push({
              bookingId: booking._id,
              clientId: booking.client.clientId,
              clientName: booking.client.clientName,
              fromDate: booking.fromDate,
              toDate: booking.toDate,
              dogs: booking.dogs,
              totalAmount: booking.totalAmount,
              flag1: booking.flag1,
              flag2: booking.flag2,
            });
          }
        }
      });
    });

    let result = Object.values(roomMap);
    if (filter === "full") {
      result = result.filter((room: any) => room.currentBookings.length > 0);
    } else if (filter === "empty") {
      result = result.filter((room: any) => room.currentBookings.length === 0);
    }
    const totalCapacity: any = rooms.length;
    const roomsArray = Object.values(roomMap);

    const roomsWithoutBookings = roomsArray.filter(
      (room: any) => room.currentBookings.length === 0
    );

    const freeCapacityPercentage =
      (roomsWithoutBookings.length / totalCapacity) * 100;
    // Calculate free capacity percentage

    // Step 6: Implement pagination
    const paginatedResult = result.slice(skipItems, skipItems + itemsPerPage);
    const hasNextPage = result.length > skipItems + itemsPerPage;

    return {
      allRooms: paginatedResult,
      isNext: hasNextPage,
      freeCapacityPercentage: freeCapacityPercentage.toFixed(2),
    };
  } catch (error) {
    console.error("Error finding bookings within date range:", error);
    throw error;
  }
}
export async function updateBookingDates({
  path,
  fromDate,
  toDate,
  price,
  bookingId,
}: any) {
  const session = await mongoose.startSession();
  try {
    connectToDatabase();
    session.startTransaction();
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      {
        fromDate,
        toDate,
        totalAmount: price,
      },
      { new: true, session }
    );
    const service = await Service.findOneAndUpdate(
      { bookingId },
      {
        amount: price,
        date: fromDate,
      },
      { new: true, session }
    );
    if (!updatedBooking || !service) {
      throw new Error("Failed to update booking");
    }
    const oldAppointments = await Appointment.find(
      { Id: bookingId },
      {},
      { session }
    ).sort({ StartTime: 1 });
    const updateFirstAppointment = await Appointment.findOneAndUpdate(
      { _id: oldAppointments[0]._id },
      {
        StartTime: fromDate,
        EndTime: fromDate,
      },
      { new: true, session }
    );
    const updateSecondAppointment = await Appointment.findOneAndUpdate(
      { _id: oldAppointments[1]._id },
      {
        StartTime: toDate,
        EndTime: toDate,
      },
      { new: true, session }
    );
    if (!updateFirstAppointment || !updateSecondAppointment) {
      throw new Error("Failed to update appointments");
    }
    await session.commitTransaction();
    session.endSession();
    revalidatePath(path);
    revalidatePath("/calendar");
    return JSON.stringify(updatedBooking);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Failed to update booking", error);
    throw error;
  }
}
export async function deleteBooking({
  id,
  clientId,
  path,
}: {
  id: string;
  clientId: string;
  path: string;
}) {
  const session = await mongoose.startSession();
  try {
    connectToDatabase();
    session.startTransaction();
    const deletedBooking = await Booking.findByIdAndDelete(id, { session });
    const deletedService = await Service.findOneAndDelete(
      { bookingId: id },
      { session }
    );
    const updatedClient = await Client.findOneAndUpdate(
      { _id: clientId },
      {
        $pull: { owes: deletedService._id },
      },
      { new: true, session }
    );
    if (!deletedBooking || !deletedService || !updatedClient) {
      throw new Error("Failed to delete booking");
    }

    const deleteAppointments = await Appointment.deleteMany(
      { Id: id },
      { session }
    );
    if (!deleteAppointments) {
      throw new Error("Failed to delete appointments");
    }

    await session.commitTransaction();
    session.endSession();
    revalidatePath(path);
    revalidatePath("/calendar");
    return JSON.stringify(deletedBooking);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Failed to delete booking", error);
  }
}

async function updateAppointment({
  id,
  subject,
  type,
  AppointmentType,
  newTState,
  newDate,
  session,
}: any) {
  const newSubject = newTState
    ? type === "flag1"
      ? `${subject.replace("ΑΦΙΞΗ", "ΠΑΡΑΛΑΒΗ")}`
      : `${subject.replace("ΑΝΑΧΩΡΗΣΗ", "ΠΑΡΑΔΟΣΗ")}`
    : type === "flag1"
      ? `${subject.replace("ΠΑΡΑΛΑΒΗ", "ΑΦΙΞΗ")}`
      : `${subject.replace("ΠΑΡΑΔΟΣΗ", "ΑΝΑΧΩΡΗΣΗ")}`;
  const newType = newTState
    ? type === "flag1"
      ? "Taxi_PickUp"
      : "Taxi_Delivery"
    : type === "flag1"
      ? "Arrival"
      : "Departure";
  const updateAppointment = await Appointment.findOneAndUpdate(
    { _id: id },
    {
      Subject: newSubject,
      Type: newType,
      StartTime: newDate,
      EndTime: newDate,
    },
    { new: true, session }
  );
  if (!updateAppointment) {
    throw new Error("Failed to update appointment");
  }
  return updateAppointment;
}

export async function updateTnt({
  id,
  type,
  time,
  initialDate,
  oldTState,
  newTState,
  transportFee,
  path,
}: TNTPROPS) {
  const session = await mongoose.startSession();
  const newDate = setTimeOnDate(initialDate, time);
  try {
    await connectToDatabase();
    session.startTransaction();

    const isSameState = oldTState === newTState;
    const index = type === "flag1" ? 0 : 1;
    const dateType = type === "flag1" ? "fromDate" : "toDate";

    const updateData: any = { [dateType]: newDate, [type]: newTState };
    if (!isSameState) {
      // If the state has changed, update the totalAmount
      updateData.flag = newTState;
      const incValue = newTState ? transportFee : -transportFee;
      updateData.$inc = { totalAmount: incValue };
    }

    const updateBooking = await Booking.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, session }
    );

    if (!updateBooking) {
      throw new Error("Failed to update booking");
    }

    if (!isSameState) {
      const incValue = newTState ? transportFee : -transportFee;
      const updatedService = await Service.findOneAndUpdate(
        { bookingId: id },
        { $inc: { amount: incValue } },
        { new: true, session }
      );
      if (!updatedService) {
        throw new Error("Failed to update service");
      }
    }

    const oldAppointments = await Appointment.find(
      { Id: id },
      {},
      { session }
    ).sort({ StartTime: 1 });
    const appointmentId = oldAppointments[index]._id;
    const subject = oldAppointments[index].Subject;
    const AppointmentType = oldAppointments[index].Type;
    await updateAppointment({
      id: appointmentId,
      subject,
      type,
      AppointmentType,
      newTState,
      newDate,
      session,
    });

    await session.commitTransaction();
    revalidatePath(path);
    revalidatePath("/calendar");
    return JSON.stringify(updateBooking);
  } catch (error) {
    await session.abortTransaction();
    console.error("Failed to update booking", error);
    throw error;
  } finally {
    session.endSession();
  }
}
export async function getAllAvailableRooms({
  rangeDate,
}: {
  rangeDate: DateRange;
}) {
  try {
    connectToDatabase();

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

    const rooms = await Room.find({}, {}, { sort: { name: -1 } });
    const bookings = await Booking.find(
      matchBookings,
      {},
      { sort: { fromDate: 1 } }
    );

    const roomMap = rooms.reduce((map, room) => {
      map[room._id.toString()] = {
        name: room.name,
        _id: room._id,
        currentBookings: [],
      };
      return map;
    }, {});
    bookings.forEach((booking) => {
      booking.dogs.forEach((dog: any) => {
        const roomId = dog.roomId.toString();
        if (roomMap[roomId]) {
          // Check if the booking is already added to the room's currentBookings
          const isBookingAlreadyAdded = roomMap[roomId].currentBookings.some(
            (b: any) => b.bookingId.toString() === booking._id.toString()
          );

          // If not added, push the booking to the currentBookings array
          if (!isBookingAlreadyAdded) {
            roomMap[roomId].currentBookings.push({
              bookingId: booking._id,
              clientId: booking.client.clientId,
              clientName: booking.client.clientName,
              fromDate: booking.fromDate,
              toDate: booking.toDate,
              dogs: booking.dogs,
              totalAmount: booking.totalAmount,
              flag1: booking.flag1,
              flag2: booking.flag2,
            });
          }
        }
      });
    });

    const emptyRooms = Object.values(roomMap).filter(
      (room: any) => room.currentBookings.length === 0
    );

    const totalCapacity: any = rooms.length;
    const roomsArray = Object.values(roomMap);

    const roomsWithoutBookings = roomsArray.filter(
      (room: any) => room.currentBookings.length === 0
    );

    const freeCapacityPercentage =
      (roomsWithoutBookings.length / totalCapacity) * 100;
    // Calculate free capacity percentage

    // Step 6: Implement pagination

    return {
      emptyRooms: JSON.parse(JSON.stringify(emptyRooms)),

      freeCapacityPercentage: freeCapacityPercentage.toFixed(2),
    };
  } catch (error) {
    console.error("Error finding bookings within date range:", error);
    throw error;
  }
}
