/* eslint-disable camelcase */
"use server";

import { connectToDatabase } from "../mongoose";
import Booking from "@/database/models/booking.model";
import mongoose from "mongoose";
import Room from "@/database/models/room.model";
import { revalidatePath } from "next/cache";
import Client from "@/database/models/client.model";
import { DateRange } from "react-day-picker";
import Appointment from "@/database/models/event.model";
import Service from "@/database/models/service.model";

import { calculateTotalPrice, setTimeOnDate } from "../utils";

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
  extraDay: boolean;
  dateArrival: Date | undefined;
  dateDeparture: Date | undefined;
  boardingPrice: number;
  transportationPrice: number;
  path: string;
  dogsData: any;
  flag1: Boolean;
  flag2: Boolean;
  roomPrefer: string;
}

export async function createBooking({
  dateArrival,
  dateDeparture,
  client,
  boardingPrice = 30,
  transportationPrice,
  path,
  flag1,
  flag2,
  dogsData,
  roomPrefer,
  extraDay,
}: ICreateBooking) {
  if (!dateArrival || !dateDeparture) {
    throw new Error("Invalid date range");
  }

  const maxRetries = 3; // Reduced retries for efficiency
  let attempt = 0;
  let success = false;

  // Begin retry loop
  while (attempt < maxRetries && !success) {
    const session = await mongoose.startSession();

    try {
      await connectToDatabase(); // Ensure the DB is connected
      session.startTransaction(); // Start the session transaction

      console.log(
        `Attempt ${attempt + 1}: Starting booking creation process...`
      );

      // Step 1: Generate bookingId and create services
      const bookingId = new mongoose.Types.ObjectId();
      const servicesToAdd = [];
      let totalAmount = 0;

      // Create boarding service
      console.log("Creating boarding service...");
      const boardingService: any = await Service.create(
        [
          {
            serviceType: "ΔΙΑΜΟΝΗ",
            amount: boardingPrice,
            clientId: client.clientId,
            bookingId,
            date: dateArrival,
          },
        ],
        { session }
      );
      if (!boardingService[0])
        throw new Error("Boarding service creation failed");
      servicesToAdd.push(boardingService[0]._id);
      totalAmount += boardingPrice;
      console.log("firstTotalAmount", totalAmount);

      // Create transportation services based on flags
      if (flag1) {
        console.log("Creating pick-up transportation service...");
        const pickUpService: any = await Service.create(
          [
            {
              serviceType: "Pet Taxi (Pick-Up)",
              amount: transportationPrice,
              clientId: client.clientId,
              bookingId,
              date: dateArrival,
            },
          ],
          { session }
        );
        if (!pickUpService[0])
          throw new Error("Pick-up service creation failed");
        servicesToAdd.push(pickUpService[0]._id);
        totalAmount += transportationPrice;
      }

      if (flag2) {
        console.log("Creating drop-off transportation service...");
        const dropOffService: any = await Service.create(
          [
            {
              serviceType: "Pet Taxi (Drop-Off)",
              amount: transportationPrice,
              clientId: client.clientId,
              bookingId,
              date: dateDeparture,
            },
          ],
          { session }
        );
        if (!dropOffService[0])
          throw new Error("Drop-off service creation failed");
        servicesToAdd.push(dropOffService[0]._id);
        totalAmount += transportationPrice;
      }

      // Step 2: Create the booking
      console.log("Creating booking...");
      const booking = await Booking.create(
        [
          {
            _id: bookingId,
            client,
            fromDate: dateArrival,
            toDate: dateDeparture,
            totalAmount,
            extraDay,
            flag1,
            flag2,
            dogs: dogsData,
            services: servicesToAdd,
          },
        ],
        { session }
      );
      if (!booking[0]) throw new Error("Booking creation failed");
      console.log(totalAmount, "2");
      // Step 3: Update the client with owes and room preference
      const updatedClient = await Client.findByIdAndUpdate(
        client.clientId,
        {
          $push: { owes: { $each: servicesToAdd } },
          $set: { roomPreference: roomPrefer, lastActivity: new Date() },
          $inc: { owesTotal: totalAmount },
        },
        { new: true, session }
      );
      if (!updatedClient) throw new Error("Client update failed");

      // Step 4: Create appointments
      const location = `${updatedClient.location.city ?? ""}-${
        updatedClient.location.residence ?? ""
      }-${updatedClient.location.address ?? ""}-${
        updatedClient.location.postalCode ?? ""
      }`;
      const description = `${updatedClient.name}-${dogsData
        .map(({ dogName }: any) => dogName)
        .join(", ")}`;

      if (flag1) {
        console.log("Creating pick-up appointment...");
        await Appointment.create(
          [
            {
              Id: bookingId,
              Subject: `ΠΑΡΑΛΑΒΗ`,
              clientName: updatedClient.name,
              clientId: updatedClient._id,
              mobile: updatedClient.phone.mobile,
              Type: "Taxi_PickUp",
              Description: description,
              categoryId: 3,
              dogsData,
              Location: location,
              Color: "#7f1d1d",
              isTransport: "Pet Taxi (Pick-Up)",
              isArrival: true,
              StartTime: dateArrival,
              EndTime: dateArrival,
            },
          ],
          { session }
        );
      } else {
        await Appointment.create(
          [
            {
              Id: bookingId,
              Subject: `ΑΦΙΞΗ`,
              clientName: updatedClient.name,
              clientId: updatedClient._id,
              mobile: updatedClient.phone.mobile,
              Type: "Arrival",
              Description: description,
              isArrival: true,
              categoryId: 2,
              dogsData,
              Location: location,
              Color: "#7f1d1d",
              StartTime: dateArrival,
              EndTime: dateArrival,
            },
          ],
          { session }
        );
      }

      if (flag2) {
        console.log("Creating drop-off appointment...");
        await Appointment.create(
          [
            {
              Id: bookingId,
              Subject: `ΠΑΡΑΔΟΣΗ`,
              clientName: updatedClient.name,
              clientId: updatedClient._id,
              mobile: updatedClient.phone.mobile,
              Type: "Taxi_Delivery",
              Description: description,
              Location: location,
              dogsData,
              categoryId: 3,
              isTransport: "Pet Taxi (Drop-Off)",
              isArrival: false,
              Color: "#7f1d1d",
              StartTime: dateDeparture,
              EndTime: dateDeparture,
            },
          ],
          { session }
        );
      } else {
        await Appointment.create(
          [
            {
              Id: bookingId,
              Subject: `ΑΝΑΧΩΡΗΣΗ`,
              clientName: updatedClient.name,
              clientId: updatedClient._id,
              mobile: updatedClient.phone.mobile,
              Type: "Departure",
              Description: description,
              Location: location,
              dogsData,
              categoryId: 4,
              isArrival: false,
              Color: "#7f1d1d",
              StartTime: dateDeparture,
              EndTime: dateDeparture,
            },
          ],
          { session }
        );
      }

      // Step 5: Commit the transaction
      await session.commitTransaction();
      console.log("Transaction committed successfully.");
      success = true; // Set success to true when transaction is successful

      // Revalidate paths
      revalidatePath("/calendar");
      revalidatePath(path);

      return JSON.stringify(booking[0]);
    } catch (error: any) {
      await session.abortTransaction();
      console.log(`Attempt ${attempt + 1} failed:`, error.message);

      if (attempt + 1 >= maxRetries) {
        throw new Error(
          `Failed to create booking after ${maxRetries} attempts: ${error.message}`
        );
      }
    } finally {
      session.endSession();
    }

    attempt++; // Increment the attempt count after every failed attempt
  }
}

export async function getBookingById(bookingId: string) {
  try {
    connectToDatabase();
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return JSON.stringify({});
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

export async function countBookingsByMonth({
  year = new Date().getFullYear(),
}: {
  year?: number;
}) {
  // Initialize an array to store the counts and totals for each month
  const bookingsByMonth = [];

  // Loop through each month of the specified year
  const monthsInYear = 12;

  for (let month = 0; month < monthsInYear; month++) {
    // Set the start and end dates for the month
    const startDateOfMonth = new Date(year, month, 1);
    const endDateOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    try {
      // Ensure database connection
      await connectToDatabase();

      // Get count and total amount for the month
      const bookings = await Booking.aggregate([
        {
          $match: {
            fromDate: { $gte: startDateOfMonth, $lte: endDateOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      // Store the count and total for the current month
      bookingsByMonth.push({
        date: startDateOfMonth.toISOString(),
        bookings: bookings[0]?.count || 0,
        totalAmount: bookings[0]?.totalAmount || 0,
      });
    } catch (error) {
      console.error(
        `Error counting bookings for ${startDateOfMonth.toLocaleString(
          "en-US",
          { month: "long" }
        )}, ${year}:`,
        error
      );
    }
  }

  return bookingsByMonth;
}

export async function getAllBookings({
  fromDate,
  toDate,

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
    await connectToDatabase(); // Awaiting database connection
    session.startTransaction();

    const deletedBooking = await Booking.findByIdAndDelete(id, { session });

    const servicesToDelete = await Service.find(
      {
        bookingId: id,
        paid: false, // Only select unpaid services
      },
      { _id: 1 } // Only retrieve the `_id` field
    ).session(session);

    const deletedServices = await Service.deleteMany(
      {
        bookingId: id,
        paid: false, // Only delete unpaid services
      },
      { session }
    );

    // Fetch unpaid services
    const unpaidService = await Service.find({ bookingId: id, paid: false });

    // Safely handle the amountToDelete logic
    const amountToDelete =
      unpaidService.length > 0 ? unpaidService[0].amount : 0;

    const serviceIds = servicesToDelete.map((service: any) => service._id);

    const updatedClient = await Client.findOneAndUpdate(
      { _id: clientId },
      {
        $pull: { owes: { $in: serviceIds } },
        $inc: { owesTotal: -amountToDelete },
      },
      { new: true, session }
    );

    if (!deletedBooking || !deletedServices || !updatedClient) {
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
    throw error; // Ensure the error is thrown, so it can be handled correctly
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
  dateArrival,
  dateDeparture,
}: {
  dateArrival: Date;
  dateDeparture: Date;
}) {
  try {
    connectToDatabase();

    const matchBookings = {
      $or: [
        {
          $and: [
            { fromDate: { $lte: dateDeparture } },
            { toDate: { $gte: dateDeparture } },
          ],
        },
        {
          $and: [
            { fromDate: { $lte: dateArrival } },
            { toDate: { $gte: dateArrival } },
          ],
        },
        {
          $and: [
            { fromDate: { $gte: dateArrival } },
            { toDate: { $lte: dateDeparture } },
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

    // Step 6: Implement de

    return {
      emptyRooms: JSON.parse(JSON.stringify(emptyRooms)),

      freeCapacityPercentage: freeCapacityPercentage.toFixed(2),
    };
  } catch (error) {
    console.error("Error finding bookings within date range:", error);
    throw error;
  }
}
export async function checkBookingRoomAvailability({
  date,
  bookingId,
  type,
}: {
  date: Date;
  bookingId: string;
  type: string;
}) {
  try {
    connectToDatabase();

    // Fetch the booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Determine if this is an arrival or departure update
    const isArrival = type === "Arrival" || type === "Taxi_PickUp";
    const { fromDate, toDate, dogs } = booking;

    // Create new range date based on dragged event
    let newRangeDate;
    if (isArrival) {
      newRangeDate = { from: date, to: toDate };
    } else {
      newRangeDate = { from: fromDate, to: date };
    }

    // Query to find bookings that overlap with the new range
    const matchBookings = {
      $or: [
        {
          $and: [
            { fromDate: { $lte: newRangeDate.to } },
            { toDate: { $gte: newRangeDate.to } },
          ],
        },
        {
          $and: [
            { fromDate: { $lte: newRangeDate.from } },
            { toDate: { $gte: newRangeDate.from } },
          ],
        },
        {
          $and: [
            { fromDate: { $gte: newRangeDate.from } },
            { toDate: { $lte: newRangeDate.to } },
          ],
        },
      ],
    };

    // Fetch the matching bookings
    const bookings = await Booking.find(matchBookings);

    // Extract room IDs from the dragged booking's dogs
    const roomIds = dogs.map((dog: any) => dog.roomId.toString());

    // Filter overlapping bookings, exclude the current booking being dragged
    const overlappingBookings = bookings.filter(
      (b: any) =>
        b._id.toString() !== bookingId && // Exclude the current booking
        b.dogs.some((dog: any) => roomIds.includes(dog.roomId.toString()))
    );

    // Return true if there are any overlapping bookings
    return overlappingBookings.length > 0;
  } catch (error) {
    console.error("Error checking booking room availability:", error);
    throw error;
  }
}
export async function updateBookingRoomForDog({
  bookingId,
  updatedDogsData,
}: {
  bookingId: string;
  updatedDogsData: { dogId: string; roomId: string; roomName: string }[];
}) {
  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Update the roomId and roomName for each dog
    const updatedDogs = booking.dogs.map((dog: any) => {
      const updatedDog = updatedDogsData.find(
        (update) => update.dogId.toString() === dog.dogId.toString()
      );

      if (updatedDog) {
        // Update the dog's roomId and roomName
        return {
          ...dog,
          roomId: updatedDog.roomId,
          roomName: updatedDog.roomName,
        };
      }
      return dog; // Return the dog unchanged if no updates are found
    });

    // Save the updated dogs array back to the booking
    booking.dogs = updatedDogs;
    await booking.save();

    return true;
  } catch (error) {
    console.error("Error updating room in booking for dogs:", error);
    throw new Error("Failed to update room for dogs in the booking.");
  }
}
export async function checkBookingRoomRangeDateAvailability({
  rangeDate,
  bookingId,
}: {
  rangeDate: DateRange;
  bookingId: string;
}) {
  try {
    connectToDatabase();

    // Fetch the booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Determine if this is an arrival or departure update

    // Create new range date based on dragged event

    // Query to find bookings that overlap with the new range
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

    // Fetch the matching bookings
    const bookings = await Booking.find(matchBookings);

    // Extract room IDs from the dragged booking's dogs
    const roomIds = booking.dogs.map((dog: any) => dog.roomId.toString());

    // Filter overlapping bookings, exclude the current booking being dragged
    const overlappingBookings = bookings.filter(
      (b: any) =>
        b._id.toString() !== bookingId && // Exclude the current booking
        b.dogs.some((dog: any) => roomIds.includes(dog.roomId.toString()))
    );

    // Return true if there are any overlapping bookings
    return overlappingBookings.length > 0;
  } catch (error) {
    console.error("Error checking booking room availability:", error);
    throw error;
  }
}
export async function updateBookingAllInclusive({
  dogsData,
  booking,
  extraDay,
  rangeDate,
  isTransport1,
  isTransport2,
  roomPreference,
}: any) {
  const session = await mongoose.startSession(); // Start session
  await connectToDatabase(); // Ensure single connection

  try {
    session.startTransaction(); // Start transaction

    const servicesToAdd = [];
    const servicesToDelete = [];

    let calculateBoardingFee = calculateTotalPrice({
      fromDate: rangeDate.from,
      toDate: rangeDate.to,
      dailyPrice: booking.client.bookingFee,
    });
    if (extraDay && !booking.extraDay) {
      calculateBoardingFee += booking.client.bookingFee;
    } else if (!extraDay && booking.extraDay) {
      calculateBoardingFee -= booking.client.bookingFee;
    }
    let calculateTotalAmount = 0;
    calculateTotalAmount += calculateBoardingFee;
    if (isTransport1) {
      calculateTotalAmount += booking.client.transportFee;
    }
    if (isTransport2) {
      calculateTotalAmount += booking.client.transportFee;
    }
    console.log("Total amount:", calculateTotalAmount);

    // Update booking
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: booking._id },
      {
        dogs: dogsData,
        totalAmount: calculateTotalAmount,
        fromDate: rangeDate.from,
        toDate: rangeDate.to,
        flag1: isTransport1,
        flag2: isTransport2,
      },
      { new: true, session } // Pass session
    );
    if (!updatedBooking) {
      throw new Error("Failed to update booking");
    }

    // Update service
    const updatedService = await Service.findOneAndUpdate(
      { bookingId: booking._id, serviceType: "ΔΙΑΜΟΝΗ" },
      {
        amount: calculateBoardingFee,
        remaingAmount: calculateBoardingFee,
        date: rangeDate.from,
      },
      { new: true, session } // Pass session
    );
    if (!updatedService) {
      throw new Error("Failed to update service");
    }

    // Handle Transport 1 (Pick-up)
    if (isTransport1 && booking.flag1) {
      const updatedPickUpService = await Service.findOneAndUpdate(
        { bookingId: booking._id, serviceType: "Pet Taxi (Pick-Up)" },
        { date: rangeDate.from },
        { new: true, session } // Pass session
      );
      const updatedAppointment = await Appointment.findOneAndUpdate(
        { Id: booking._id, Type: "Taxi_PickUp" },
        { StartTime: rangeDate.from, EndTime: rangeDate.from },
        { new: true, session } // Pass session
      );
      if (!updatedPickUpService || !updatedAppointment) {
        throw new Error("Failed to update pick-up service");
      }
    } else if (isTransport1 && !booking.flag1) {
      const pickUpService = await Service.create(
        [
          {
            serviceType: "Pet Taxi (Pick-Up)",
            amount: booking.client.transportFee,
            clientId: booking.client.clientId,
            bookingId: booking._id,
            date: rangeDate.from,
          },
        ],
        { session } // Pass session
      );
      const pickUpAppointment = await Appointment.findOneAndUpdate(
        { Id: booking._id, Type: "Arrival" },
        {
          StartTime: rangeDate.from,
          EndTime: rangeDate.from,
          Subject: `ΠΑΡΑΛΑΒΗ`,
          Type: "Taxi_PickUp",
          categoryId: 3,
          isTransport: "Pet Taxi (Pick-Up)",
        },
        { new: true, session } // Pass session
      );
      if (!pickUpService[0] || !pickUpAppointment) {
        throw new Error("Pick-up service creation failed");
      }
      servicesToAdd.push(pickUpService[0]);
    } else if (!isTransport1 && booking.flag1) {
      const deletedPickUpService = await Service.findOneAndDelete(
        { bookingId: booking._id, serviceType: "Pet Taxi (Pick-Up)" },
        { session } // Pass session
      );
      const updatedAppointment = await Appointment.findOneAndUpdate(
        { Id: booking._id, Type: "Taxi_PickUp" },
        {
          StartTime: rangeDate.from,
          EndTime: rangeDate.from,
          Subject: `ΑΦΙΞΗ`,
          Type: "Arrival",
          categoryId: 2,
          $unset: { isTransport: "" },
        },
        { new: true, session } // Pass session
      );
      if (!deletedPickUpService || !updatedAppointment) {
        throw new Error("Failed to delete pick-up service");
      }
      servicesToDelete.push(deletedPickUpService);
    }

    // Handle Transport 2 (Drop-off)
    if (isTransport2 && booking.flag2) {
      const updatedDropOffService = await Service.findOneAndUpdate(
        { bookingId: booking._id, serviceType: "Pet Taxi (Drop-Off)" },
        { date: rangeDate.to },
        { new: true, session } // Pass session
      );
      const updatedAppointment = await Appointment.findOneAndUpdate(
        { Id: booking._id, Type: "Taxi_Delivery" },
        { StartTime: rangeDate.to, EndTime: rangeDate.to },
        { new: true, session } // Pass session
      );
      if (!updatedDropOffService || !updatedAppointment) {
        throw new Error("Failed to update drop-off service");
      }
    } else if (isTransport2 && !booking.flag2) {
      const dropOffService = await Service.create(
        [
          {
            serviceType: "Pet Taxi (Drop-Off)",
            amount: booking.client.transportFee,
            clientId: booking.client.clientId,
            bookingId: booking._id,
            date: rangeDate.to,
          },
        ],
        { session } // Pass session
      );
      const dropOffAppointment = await Appointment.findOneAndUpdate(
        { Id: booking._id, Type: "Departure" },
        {
          StartTime: rangeDate.to,
          EndTime: rangeDate.to,
          Subject: `ΠΑΡΑΔΟΣΗ`,
          Type: "Taxi_Delivery",
          categoryId: 3,
          isTransport: "Pet Taxi (Drop-Off)",
        },
        { new: true, session } // Pass session
      );
      if (!dropOffService[0] || !dropOffAppointment) {
        throw new Error("Drop-off service creation failed");
      }
      servicesToAdd.push(dropOffService[0]);
    } else if (!isTransport2 && booking.flag2) {
      const deletedDropOffService = await Service.findOneAndDelete(
        { bookingId: booking._id, serviceType: "Pet Taxi (Drop-Off)" },
        { session } // Pass session
      );
      const updatedAppointment = await Appointment.findOneAndUpdate(
        { Id: booking._id, Type: "Taxi_Delivery" },
        {
          StartTime: rangeDate.to,
          EndTime: rangeDate.to,
          Subject: `ΑΝΑΧΩΡΗΣΗ`,
          Type: "Departure",
          categoryId: 2,
          $unset: { isTransport: "" },
        },
        { new: true, session } // Pass session
      );
      if (!deletedDropOffService || !updatedAppointment) {
        throw new Error("Failed to delete drop-off service");
      }
      servicesToDelete.push(deletedDropOffService);
    }
    await Booking.findOneAndUpdate(
      { _id: booking._id },
      { $pull: { services: { $in: servicesToDelete } } },
      { session }
    );
    await Booking.findOneAndUpdate(
      { _id: booking._id },
      { $push: { services: { $each: servicesToAdd } } },
      { session }
    );

    await Client.findOneAndUpdate(
      { _id: booking.client.clientId },
      { $pull: { owes: { $in: servicesToDelete } } },
      { session } // Pass session
    );
    const updateClient = await Client.findOneAndUpdate(
      { _id: booking.client.clientId },
      {
        $push: { owes: { $each: servicesToAdd } },
        owesTotal: calculateTotalAmount,
        lastActivity: new Date(),
        roomPreference,
      },
      { new: true, session } // Pass session
    );
    if (!updateClient) {
      throw new Error("Failed to update client");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Re
    revalidatePath("/calendar");
    revalidatePath("/bookings");

    return JSON.stringify(updatedBooking);
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.log("Failed to update booking", error);
    throw error;
  }
}
