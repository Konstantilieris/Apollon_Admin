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
import Payment from "@/database/models/payment.model";
import FinancialSummary from "@/database/models/financial.model";
import moment from "moment";

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
  extraDayPrice: number;
}

export async function createBooking({
  dateArrival,
  dateDeparture,
  client,
  boardingPrice,
  transportationPrice,
  extraDayPrice,
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
      // Calculate total amount
      let totalAmount = extraDayPrice + boardingPrice;

      // Create boarding service
      console.log("Creating boarding service...");
      const boardingService: any = await Service.create(
        [
          {
            serviceType: "ΔΙΑΜΟΝΗ",
            amount: totalAmount,
            clientId: client.clientId,
            bookingId,
            date: dateArrival,
            endDate: dateDeparture,
          },
        ],
        { session }
      );
      if (!boardingService[0])
        throw new Error("Boarding service creation failed");
      servicesToAdd.push(boardingService[0]._id);

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
              endDate: dateArrival,
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
              endDate: dateDeparture,
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
      const appointmentsToCreate = [];
      if (flag1) {
        console.log("Creating pick-up appointment...");
        appointmentsToCreate.push({
          Id: bookingId.toString(), // Ensure string format
          bookingId, // Ensure bookingId is set
          Subject: "ΠΑΡΑΛΑΒΗ",
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
        });
      } else {
        appointmentsToCreate.push({
          Id: bookingId.toString(),
          bookingId,
          Subject: "ΑΦΙΞΗ",
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
        });
      }

      if (flag2) {
        console.log("Creating drop-off appointment...");
        appointmentsToCreate.push({
          Id: bookingId.toString(),
          bookingId,
          Subject: "ΠΑΡΑΔΟΣΗ",
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
        });
      } else {
        appointmentsToCreate.push({
          Id: bookingId.toString(),
          bookingId,
          Subject: "ΑΝΑΧΩΡΗΣΗ",
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
        });
      }
      await Appointment.insertMany(appointmentsToCreate, { session });
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
          paidAmount: 1,
          dogs: 1,
          flag1: 1,
          flag2: 1,
          client: 1,
        },
      },
      {
        $sort: { fromDate: 1, toDate: 1 },
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
        endDate: toDate,
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
  id, // The booking ID
  clientId, // The client who owns the booking
  path, // A path to revalidate in Next.js
}: {
  id: string;
  clientId: string;
  path: string;
}) {
  const session = await mongoose.startSession();

  try {
    await connectToDatabase();
    session.startTransaction();

    // 1. Find the booking
    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // 2. Collect ALL services (paid or unpaid) for this booking
    const allServices = await Service.find({ bookingId: id }).session(session);

    // If no services exist, you might still want to delete the booking
    if (!allServices || allServices.length === 0) {
      // We'll proceed, but no service cleanup is needed if there are truly none
      console.log("No services found for this booking");
    }

    // Keep track of how much total paid we remove from these services.
    let totalRemovedFromPayments = 0;
    let totalRemainingOwes = 0; // sum of remaining amounts for all services

    // 3. For each service, we gather amounts and handle Payment docs
    const serviceIds = allServices.map((svc) => svc._id.toString());

    for (const svc of allServices) {
      // Tally up any amounts that affect the client
      totalRemainingOwes += svc.remainingAmount || 0;

      // We'll remove the portion from Payment docs that references this service
      // whether it's single-service or multi-service allocations.

      // 3A. Find all non-reversed payments referencing this service in EITHER:
      //     - payment.serviceId == svc._id
      //     - payment.allocations[].serviceId == svc._id
      const payments = await Payment.find({
        reversed: false,
        $or: [
          { serviceId: svc._id }, // dedicated single-service payment
          { "allocations.serviceId": svc._id }, // multi-service allocations
        ],
      }).session(session);

      // 3B. For each payment, remove or reduce the service's allocation
      for (const payment of payments) {
        let removedAmount = 0;

        // Case 1: If payment.serviceId matches this service exactly,
        //         remove or reverse the entire Payment amount
        if (
          payment.serviceId &&
          payment.serviceId.toString() === svc._id.toString()
        ) {
          removedAmount = payment.amount;
          // Either delete or mark reversed. Let's do a full delete for simplicity:
          await Payment.findByIdAndDelete(payment._id).session(session);
        } else {
          // Case 2: We have allocations for multiple services
          // Filter out the allocation for this specific service
          const newAllocations = [];
          for (const alloc of payment.allocations || []) {
            if (alloc.serviceId.toString() === svc._id.toString()) {
              removedAmount += alloc.amount;
            } else {
              newAllocations.push(alloc);
            }
          }
          // Subtract the removed portion from the payment's total
          payment.amount -= removedAmount;

          // If there's nothing left, we can remove or reverse the Payment
          if (payment.amount <= 0 || newAllocations.length === 0) {
            await Payment.findByIdAndDelete(payment._id).session(session);
          } else {
            // Otherwise, save updated allocations
            payment.allocations = newAllocations;
            await payment.save({ session });
          }
        }
        // Keep a grand total of how much we removed across all payments
        totalRemovedFromPayments += removedAmount;
      }
    }

    // 4. Update the Client
    //    - Remove these service IDs from the owes array
    //    - Subtract totalRemainingOwes from owesTotal
    //    - Subtract totalRemovedFromPayments from totalSpent
    const client = await Client.findOneAndUpdate(
      { _id: clientId },
      {
        $pull: { owes: { $in: serviceIds } },
        $inc: {
          owesTotal: -totalRemainingOwes,
          totalSpent: -totalRemovedFromPayments,
        },
      },
      { new: true, session }
    );

    if (!client) {
      throw new Error("Failed to update client or client not found.");
    }

    // 5. Update FinancialSummary
    //    - Subtract whatever portion was removed from payments from totalRevenue
    if (totalRemovedFromPayments > 0) {
      await FinancialSummary.findOneAndUpdate(
        {},
        { $inc: { totalRevenue: -totalRemovedFromPayments } },
        { session }
      );
    }

    // 6. Delete all services referencing this booking
    //    (We want them gone, whether they were paid or unpaid)
    if (allServices.length > 0) {
      await Service.deleteMany({ bookingId: id }, { session });
    }

    // 7. Delete any appointments that reference this booking
    await Appointment.deleteMany({ Id: id }, { session });

    // 8. Delete the booking itself
    await Booking.findByIdAndDelete(id, { session });

    // 9. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // 10. Revalidate paths in Next.js
    revalidatePath(path);
    revalidatePath("/calendar");

    return { message: "Booking deleted successfully." };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Failed to delete booking", error);
    throw error;
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

/**
 * Helper function to create/update/remove Pet Taxi services & appointments.
 */
async function handlePetTaxiService({
  booking,
  session,
  rangeDate,
  dogsData,
  transportFlag, // e.g. isTransport1 / isTransport2
  originalFlag, // e.g. booking.flag1 / booking.flag2
  serviceType, // "Pet Taxi (Pick-Up)" / "Pet Taxi (Drop-Off)"
  defaultSubject, // e.g. "ΠΑΡΑΛΑΒΗ" / "ΠΑΡΑΔΟΣΗ"
  defaultType, // e.g. "Taxi_PickUp" / "Taxi_Delivery"
  fallbackSubject, // e.g. "ΑΦΙΞΗ" / "ΑΝΑΧΩΡΗΣΗ"
  fallbackType, // e.g. "Arrival" / "Departure"
  categoryIdWithTaxi, // e.g. 3
  categoryIdWithoutTaxi, // e.g. 2
  dateToUse, // new Date(rangeDate.from) or new Date(rangeDate.to)
}: {
  booking: any;
  session: any;
  rangeDate: { from: Date; to: Date };
  dogsData: any;
  transportFlag: boolean;
  originalFlag: boolean;
  serviceType: string;
  defaultSubject: string;
  defaultType: string;
  fallbackSubject: string;
  fallbackType: string;
  categoryIdWithTaxi: number;
  categoryIdWithoutTaxi: number;
  dateToUse: Date;
}) {
  // CASE A: We want transport now, AND we previously wanted transport => just update the existing Service + Appointment
  if (transportFlag && originalFlag) {
    const existingService = await Service.findOne({
      bookingId: booking._id,
      serviceType,
    }).session(session);

    if (!existingService) {
      throw new Error(`Could not find existing service for ${serviceType}`);
    }
    // doc-based update to ensure we update endDate & date
    existingService.date = dateToUse;
    existingService.endDate = dateToUse;
    await existingService.save({ session });

    // Update existing Appointment
    const updatedAppt = await Appointment.findOneAndUpdate(
      {
        Id: booking._id,
        Type: defaultType, // "Taxi_PickUp" / "Taxi_Delivery"
      },
      {
        StartTime: dateToUse,
        EndTime: dateToUse,
        dogsData,
      },
      { new: true, session }
    );
    if (!updatedAppt) {
      throw new Error(
        `Failed to update existing appointment for ${serviceType}`
      );
    }
  }
  // CASE B: We want transport now, but previously we did NOT => create new Service + transform existing arrival/departure
  else if (transportFlag && !originalFlag) {
    const newServiceDocs = await Service.create(
      [
        {
          serviceType,
          amount: booking.client.transportFee ?? 30,
          clientId: booking.client.clientId,
          bookingId: booking._id,
          date: dateToUse,
          endDate: dateToUse,
        },
      ],
      { session }
    );
    const newService = newServiceDocs[0];

    const newAppt = await Appointment.findOneAndUpdate(
      {
        Id: booking._id,
        Type: fallbackType, // "Arrival" / "Departure"
      },
      {
        StartTime: dateToUse,
        EndTime: dateToUse,
        dogsData,
        Subject: defaultSubject, // "ΠΑΡΑΛΑΒΗ" / "ΠΑΡΑΔΟΣΗ"
        Type: defaultType, // "Taxi_PickUp" / "Taxi_Delivery"
        categoryId: categoryIdWithTaxi,
        isTransport: serviceType,
      },
      { new: true, session }
    );

    if (!newService || !newAppt) {
      throw new Error(
        `Failed to create new ${serviceType} service or appointment`
      );
    }
    return newService; // Return so we know what to add to booking/client
  }
  // CASE C: We do NOT want transport now, but we previously DID => remove existing Service + revert appointment
  else if (!transportFlag && originalFlag) {
    const deletedService = await Service.findOneAndDelete(
      {
        bookingId: booking._id,
        serviceType,
      },
      { session }
    );

    const revertedAppt = await Appointment.findOneAndUpdate(
      {
        Id: booking._id,
        Type: defaultType,
      },
      {
        dogsData,
        StartTime: dateToUse,
        EndTime: dateToUse,
        Subject: fallbackSubject, // "ΑΦΙΞΗ" / "ΑΝΑΧΩΡΗΣΗ"
        Type: fallbackType, // "Arrival" / "Departure"
        categoryId: categoryIdWithoutTaxi,
        $unset: { isTransport: "" },
      },
      { new: true, session }
    );
    if (!deletedService || !revertedAppt) {
      throw new Error(
        `Failed to delete ${serviceType} or revert appointment for ${serviceType}`
      );
    }
    return deletedService; // Return so we can remove from booking/client
  }
  // CASE D: We do NOT want transport now, and we previously did NOT => just ensure the existing arrival/departure date is correct
  else {
    const updatedAppt = await Appointment.findOneAndUpdate(
      {
        Id: booking._id,
        Type: fallbackType,
      },
      {
        StartTime: dateToUse,
        EndTime: dateToUse,
        dogsData,
      },
      { new: true, session }
    );
    if (!updatedAppt) {
      throw new Error(`Failed to update ${fallbackType} appointment date.`);
    }
  }

  return null;
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
  // Ensure DB connected
  await connectToDatabase();
  const session = await mongoose.startSession();
  session.startTransaction();
  const fromDate = new Date(rangeDate.from);
  const toDate = new Date(rangeDate.to);
  try {
    // 1) Make sure client fees are set
    if (!booking.client.transportFee || !booking.client.bookingFee) {
      const client = await Client.findById(booking.client.clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      if (!booking.client.transportFee) {
        const transportFeeService = client.serviceFees?.find(
          (s: any) => s.type === "transportFee"
        );
        booking.client.transportFee = transportFeeService
          ? transportFeeService.value
          : 30;
      }

      if (!booking.client.bookingFee) {
        const bookingFeeService = client.serviceFees?.find(
          (s: any) => s.type === "bookingFee"
        );
        booking.client.bookingFee = bookingFeeService
          ? bookingFeeService.value
          : 30;
      }
    }

    // 2) Update all appointments with new dog data
    const updatedAppts = await Appointment.updateMany(
      { Id: booking._id },
      { dogsData },
      { session }
    );
    if (!updatedAppts) {
      throw new Error("Failed to update appointments with new dogsData");
    }

    // 3) Get the existing Boarding service (ΔΙΑΜΟΝΗ)
    const oldBoardingService = await Service.findOne({
      bookingId: booking._id,
      serviceType: "ΔΙΑΜΟΝΗ",
    }).session(session);

    if (!oldBoardingService) {
      throw new Error("Boarding service (ΔΙΑΜΟΝΗ) not found for this booking.");
    }

    // 4) If old service is paid and the new date range is reduced, forbid
    const isRangeReduced =
      moment(rangeDate.from).isAfter(moment(booking.fromDate)) ||
      moment(rangeDate.to).isBefore(moment(booking.toDate));
    if (oldBoardingService.paid && isRangeReduced) {
      throw new Error(
        "Cannot update a paid service with a reduced date range."
      );
    }

    // 5) Calculate new boarding fee
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

    // 6) Add transport fees
    let calculateTotalAmount = calculateBoardingFee;
    if (isTransport1) {
      calculateTotalAmount += booking.client.transportFee;
    }
    if (isTransport2) {
      calculateTotalAmount += booking.client.transportFee;
    }

    // 7) Add tax
    const taxRate = oldBoardingService.taxRate ?? 0;

    // 8) Paid portion so far
    const paidAmount =
      oldBoardingService.amount - (oldBoardingService.remainingAmount ?? 0);

    // 9) Update the main Booking doc
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: booking._id },
      {
        dogs: dogsData,
        client: {
          transportFee: booking.client.transportFee,
          bookingFee: booking.client.bookingFee,
          clientId: booking.client.clientId,
          clientName: booking.client.clientName,
          phone: booking.client.phone,
          location: booking.client.location,
        },
        totalAmount: calculateTotalAmount,
        fromDate: rangeDate.from,
        toDate: rangeDate.to,
        extraDay,
        flag1: isTransport1,
        flag2: isTransport2,
      },
      { new: true, session }
    );
    if (!updatedBooking) {
      throw new Error("Failed to update booking document");
    }

    // 10) Update Boarding Service doc-based so date + endDate are definitely set
    oldBoardingService.amount = calculateBoardingFee;
    oldBoardingService.taxRate = taxRate;
    oldBoardingService.paidAmount = paidAmount;
    oldBoardingService.date = fromDate;
    oldBoardingService.endDate = toDate;

    await oldBoardingService.save({ session });
    console.log("AFTER SAVE =>", {
      amount: oldBoardingService.amount,
      discount: oldBoardingService.discount,
      paidAmount: oldBoardingService.paidAmount,
      taxRate: oldBoardingService.taxRate,
      totalAmount: oldBoardingService.totalAmount,
      remainingAmount: oldBoardingService.remainingAmount,
    });
    // 11) Handle Pet Taxi (Pick-Up)
    const pickUpServiceChanged = await handlePetTaxiService({
      booking: updatedBooking,
      session,
      rangeDate: {
        from: fromDate,
        to: toDate,
      },
      dogsData,
      transportFlag: isTransport1,
      originalFlag: booking.flag1,
      serviceType: "Pet Taxi (Pick-Up)",
      defaultSubject: "ΠΑΡΑΛΑΒΗ",
      defaultType: "Taxi_PickUp",
      fallbackSubject: "ΑΦΙΞΗ",
      fallbackType: "Arrival",
      categoryIdWithTaxi: 3,
      categoryIdWithoutTaxi: 2,
      dateToUse: new Date(rangeDate.from),
    });

    // 12) Handle Pet Taxi (Drop-Off)
    const dropOffServiceChanged = await handlePetTaxiService({
      booking: updatedBooking,
      session,
      rangeDate,
      dogsData,
      transportFlag: isTransport2,
      originalFlag: booking.flag2,
      serviceType: "Pet Taxi (Drop-Off)",
      defaultSubject: "ΠΑΡΑΔΟΣΗ",
      defaultType: "Taxi_Delivery",
      fallbackSubject: "ΑΝΑΧΩΡΗΣΗ",
      fallbackType: "Departure",
      categoryIdWithTaxi: 3,
      categoryIdWithoutTaxi: 2,
      dateToUse: new Date(rangeDate.to),
    });

    // 13) Track any newly created or deleted services
    const servicesToAdd = [];
    const servicesToDelete = [];

    if (pickUpServiceChanged) {
      // if newly created
      if (isTransport1 && !booking.flag1) {
        servicesToAdd.push(pickUpServiceChanged);
      }
      // if removed
      else if (!isTransport1 && booking.flag1) {
        servicesToDelete.push(pickUpServiceChanged);
      }
    }

    if (dropOffServiceChanged) {
      if (isTransport2 && !booking.flag2) {
        servicesToAdd.push(dropOffServiceChanged);
      } else if (!isTransport2 && booking.flag2) {
        servicesToDelete.push(dropOffServiceChanged);
      }
    }

    // 14) Update booking.services array
    if (servicesToDelete.length) {
      await Booking.findByIdAndUpdate(
        updatedBooking._id,
        {
          $pull: { services: { $in: servicesToDelete.map((s) => s._id) } },
        },
        { session }
      );
    }
    if (servicesToAdd.length) {
      await Booking.findByIdAndUpdate(
        updatedBooking._id,
        {
          $push: { services: { $each: servicesToAdd.map((s) => s._id) } },
        },
        { session }
      );
    }

    // 15) Update Client owes
    if (servicesToDelete.length) {
      await Client.findByIdAndUpdate(
        booking.client.clientId,
        {
          $pull: { owes: { $in: servicesToDelete.map((s) => s._id) } },
        },
        { session }
      );
    }
    const updatedClient = await Client.findByIdAndUpdate(
      booking.client.clientId,
      {
        $push: {
          owes: { $each: servicesToAdd.map((s) => s._id) },
        },
        owesTotal: calculateTotalAmount,
        lastActivity: new Date(),
        roomPreference,
      },
      { new: true, session }
    );
    if (!updatedClient) {
      throw new Error("Failed to update client with new transport fees");
    }

    // 16) Commit transaction + revalidate
    await session.commitTransaction();
    session.endSession();

    revalidatePath("/calendar");
    revalidatePath("/bookings");

    return JSON.stringify(updatedBooking);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Failed to update booking", error);
    throw error;
  }
}
